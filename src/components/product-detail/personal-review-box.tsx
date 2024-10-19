import { useCurrentUser, useCustomNavigate, useSocket } from "@/hooks";
import { Product, ReviewFullJoin, ChildReviewFullJoin } from "@/types/model";
import { SocketEmitError } from "@/types/socket";
import {
  ReviewInsertionFromProps,
  ReviewInsertionSchema,
} from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormHTMLAttributes,
  LegacyRef,
  MutableRefObject,
  forwardRef,
  useState,
} from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { User } from "lucide-react";
import { StarRating } from "@/components/common";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/badge";

interface PersonalReviewBoxProps extends FormHTMLAttributes<HTMLFormElement> {
  product: Product;
  replyToComment: ReviewFullJoin | null;
  setReplyToComment: (
    review: ReviewFullJoin | ChildReviewFullJoin | undefined
  ) => void;
}

const PersonalReviewBox = forwardRef<HTMLFormElement, PersonalReviewBoxProps>(
  (
    props,
    ref: LegacyRef<HTMLFormElement> | MutableRefObject<HTMLFormElement>
  ) => {
    const { currentUser } = useCurrentUser();
    const { navigate } = useCustomNavigate();
    const [ratingStarInput, setRatingStarInput] = useState(5);
    const { socket } = useSocket();
    const { register, handleSubmit, reset } = useForm<ReviewInsertionFromProps>(
      {
        resolver: zodResolver(ReviewInsertionSchema),
      }
    );

    const handleMakeStarRate = (rating: number) => {
      setRatingStarInput(rating);
    };

    const handleAddReview: SubmitHandler<ReviewInsertionFromProps> = (data) => {
      if (!currentUser) {
        navigate("/login", {
          unstable_viewTransition: true,
        });
        return;
      }

      socket?.emit(
        `review:create`,
        {
          productID: props.product.productID,
          userID: currentUser.userID,
          parentID: props.replyToComment?.reviewID || null,
          rating: props.replyToComment ? null : ratingStarInput,
          ...data,
        },
        (error: SocketEmitError | undefined) => {
          if (error) {
            toast.error("Gửi đánh giá thất bại!");
          } else {
            reset();
            setRatingStarInput(5);
            props.setReplyToComment(undefined);
            toast.success("Đã gửi đánh giá thành công!");
          }
        }
      );
    };

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit(handleAddReview)}
        className="px-8 py-8 space-y-4 flex flex-col border-2 border-slate-200 rounded-md shadow-md"
      >
        <div className="flex gap-4 items-center">
          <Avatar className="h-[3.5rem] w-[3.5rem] focus-visible_!outline-none ">
            <AvatarImage
              src={currentUser?.avatar || undefined}
              width={40}
              height={40}
              alt="AVT"
              className="focus-visible_!outline-none"
            />
            <AvatarFallback className="text-stone-800 hover_border-4 hover_border-primary hover_bg-primary-softer hover_text-primary focus-visible_outline-none">
              <User size={40} />
            </AvatarFallback>
          </Avatar>
          <span className="flex flex-col gap-2">
            <StarRating
              rating={ratingStarInput}
              handleRateChange={handleMakeStarRate}
            />
            <Label htmlFor="review" className="font-semibold">
              {props.replyToComment ? (
                <>
                  {`Tiếp tục dưới bình luận của `}
                  &nbsp;
                  <Badge variant="secondary" className="text-base">
                    {props.replyToComment.user.userName}
                  </Badge>
                </>
              ) : (
                "Đánh giá"
              )}
            </Label>
          </span>
        </div>

        <Textarea
          {...register(`reviewContent`)}
          id="review"
          className="px-4 mt-2 text-lg"
        />

        <Button variant="negative" className="ml-auto">
          Gửi đánh giá
        </Button>
      </form>
    );
  }
);

export default PersonalReviewBox;
