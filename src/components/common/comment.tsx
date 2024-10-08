import { Separator } from "../ui/separator";
import { User } from "lucide-react";
import { StarRating } from "../common";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FC, HTMLAttributes, MutableRefObject } from "react";
import { ReviewFullJoin, ReviewFullJoinChild } from "@/types/model";
import { useCurrentUser } from "@/hooks";
import { useSocket } from "@/hooks";
import { Optional } from "@/utils/declare";
import { SocketEmitError } from "@/types/socket";
import { toast } from "sonner";
import { Role } from "@/types/enum";

interface CommentProps extends HTMLAttributes<HTMLDivElement> {
  index?: number;
  review: ReviewFullJoin | ReviewFullJoinChild;
  setReplyToComment: (
    commentID: ReviewFullJoin | ReviewFullJoinChild | undefined
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
      (error: Optional<SocketEmitError>) => {
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
    <div key={props.index} className="flex gap-4 mb-4">
      <Avatar className="h-[4rem] w-[4rem] my-auto focus-visible_!outline-none ">
        <AvatarImage
          src={props.review.user.avatar || undefined}
          width={40}
          height={40}
          alt="AVT"
          className="focus-visible_!outline-none"
        />
        <AvatarFallback className="text-stone-800 hover_border-4 hover_border-primary hover_bg-primary-softer hover_text-primary focus-visible_outline-none">
          <User size={40} />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2 py-1 w-full justify-center">
        <div className="flex justify-between">
          <span className="text-lg font-semibold">
            {props.review.user.userName}
          </span>
          {props.review.rating && <StarRating rating={props.review.rating} />}
        </div>

        <div className="flex">
          <span className="text-base">{props.review.reviewContent}</span>
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
