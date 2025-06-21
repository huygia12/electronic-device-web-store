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
import { cn } from "@/lib/utils";

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
    const { register, getValues, handleSubmit, reset } =
      useForm<ReviewInsertionFromProps>({
        resolver: zodResolver(ReviewInsertionSchema),
      });

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

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        const data = getValues();
        event.preventDefault();
        handleAddReview(data);
      }
    };

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit(handleAddReview)}
        className={cn(
          "p-2 md_p-8 space-y-4 flex flex-col border-2 border-slate-200 rounded-md shadow-md",
          props.className
        )}
      >
        <div className="flex gap-4 items-center">
          <Avatar className="size-10 md_size-14 focus-visible_!outline-none ">
            <AvatarImage
              src={currentUser?.avatar || undefined}
              alt="AVT"
              className="focus-visible_!outline-none size-full"
            />
            <AvatarFallback className="text-stone-800 hover_border-4 hover_border-primary hover_bg-primary-softer hover_text-primary focus-visible_outline-none">
              <User className="size-full" />
            </AvatarFallback>
          </Avatar>

          <Label
            htmlFor="review"
            className="font-semibold text-base md_text-lg"
          >
            {props.replyToComment ? (
              <span>
                Tiếp tục dưới bình luận của &nbsp;
                <Badge variant="secondary" className="text-sm md_text-base">
                  {props.replyToComment.user.userName}
                </Badge>
                <span
                  className="text-sm md_text-base hover_underline cursor-pointer text-nowrap"
                  onClick={() => props.setReplyToComment(undefined)}
                >
                  | Hủy
                </span>
              </span>
            ) : (
              "Gửi đánh giá"
            )}
          </Label>
        </div>

        <Textarea
          {...register(`reviewContent`)}
          id="review"
          placeholder="Aa"
          className="px-4 mt-2 text-base md_text-lg placeholder_italic"
          onKeyDown={handleKeyDown}
        />

        <div className="flex justify-between items-center">
          <StarRating
            rating={ratingStarInput}
            handleRateChange={handleMakeStarRate}
            disabled={props.replyToComment === null}
          />
          <Button variant="negative">Gửi đánh giá</Button>
        </div>
      </form>
    );
  }
);

export default PersonalReviewBox;
