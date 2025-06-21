import { Separator } from "../ui/separator";
import { User } from "lucide-react";
import { StarRating } from "../common";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FC, HTMLAttributes, MutableRefObject } from "react";
import { ReviewFullJoin, ChildReviewFullJoin } from "@/types/model";
import { useCurrentUser } from "@/hooks";
import { useSocket } from "@/hooks";
import { SocketEmitError } from "@/types/socket";
import { toast } from "sonner";
import { Role } from "@/types/enum";

interface CommentProps extends HTMLAttributes<HTMLDivElement> {
  index?: number;
  review: ReviewFullJoin | ChildReviewFullJoin;
  setReplyToComment: (
    commentID: ReviewFullJoin | ChildReviewFullJoin | undefined
  ) => void;
  fillInRef?: MutableRefObject<HTMLFormElement | null>;
}

const Comment: FC<CommentProps> = ({ ...props }) => {
  const { currentUser } = useCurrentUser();
  const { socket } = useSocket();

  const handleDeleteReview = (reviewID: string) => {
    socket?.emit(
      `review:delete`,
      { reviewID },
      (error: SocketEmitError | undefined) => {
        if (error) {
          toast.error("Xóa đánh giá thất bại!");
        } else {
          toast.success("Đã xóa đánh giá thành công!");
        }
      }
    );
  };

  const handleReplyToComment = () => {
    if (props.fillInRef?.current) {
      props.fillInRef.current.scrollIntoView({ behavior: "smooth" });
    }
    props.setReplyToComment(props.review);
  };

  return (
    <div key={props.index} className="flex gap-2 md_gap-4 mb-4">
      <Avatar className="size-12 md_size-16 my-auto focus-visible_!outline-none ">
        <AvatarImage
          src={props.review.user.avatar || undefined}
          alt="AVT"
          className="focus-visible_!outline-none size-fit"
        />
        <AvatarFallback className="text-stone-800 hover_border-4 hover_border-primary hover_bg-primary-softer hover_text-primary focus-visible_outline-none">
          <User className="size-fit" />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2 py-1 w-full justify-center">
        {/** UPPER */}
        <div className="flex justify-between">
          <span className="text-base md_text-lg font-semibold">
            {props.review.user.userName}
          </span>
          {props.review.rating && (
            <StarRating
              rating={props.review.rating}
              className="gap-1 md_gap-2"
              starCss="size-4 md_size-5"
            />
          )}
        </div>

        {/** LOWER */}
        <div className="flex">
          <span className="text-sm md_text-base">
            {props.review.reviewContent}
          </span>
          <span className="ml-auto flex gap-2">
            <button
              onClick={handleReplyToComment}
              className="hover_underline hover_text-primary-foreground"
            >
              Trả lời
            </button>
            <Separator orientation="vertical" />
            {(props.review.userID === currentUser?.userID ||
              currentUser?.role === Role.ADMIN) && (
              <button
                onClick={() => handleDeleteReview(props.review.reviewID)}
                className="hover_underline hover_text-primary-foreground"
              >
                Xóa
              </button>
            )}
          </span>
        </div>
        <Separator />
      </div>
    </div>
  );
};

export default Comment;
