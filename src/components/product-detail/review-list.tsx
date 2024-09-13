import { ReviewFullJoin, ReviewFullJoinChild } from "@/types/api";
import { FC, HTMLAttributes, MutableRefObject } from "react";
import { Comment } from "../common";

interface ReviewListProps extends HTMLAttributes<HTMLDivElement> {
  reviews: ReviewFullJoin[];
  setReplyToComment: (
    commentID: ReviewFullJoin | ReviewFullJoinChild | undefined
  ) => void;
  reviewDisplay: number;
  setReviewDisplay: (reviews: number) => void;
  fillInRef?: MutableRefObject<HTMLFormElement | null>;
}

const ReviewList: FC<ReviewListProps> = ({ ...props }) => {
  const handleDisplayMoreReviews = () => {
    const reviewsLeft: number = props.reviews.length - props.reviewDisplay;

    if (reviewsLeft > 0) {
      props.setReviewDisplay(
        props.reviewDisplay + (reviewsLeft > 5 ? 5 : reviewsLeft)
      );
    }
  };

  if (props.reviews.length === 0) {
    return (
      <div className="flex items-center flex-col mb-10">
        <img src="/reviews.png" alt="review" width={300} />
        <span className="font-semibold">
          Sản phẩm hiện chưa có đánh giá nào!{" "}
        </span>{" "}
      </div>
    );
  }

  return (
    <div className="flex flex-col mb-10 px-6">
      {Array.from({ length: props.reviewDisplay }).map((_, index) => (
        <div key={index}>
          <Comment
            review={props.reviews[index]}
            setReplyToComment={props.setReplyToComment}
            fillInRef={props.fillInRef}
          />
          {props.reviews[index].childrenReview.length > 0 && (
            <div className="ml-12 mb-8">
              {Array.from({
                length: props.reviews[index].childrenReview.length,
              }).map((_, childIndex) => (
                <Comment
                  key={childIndex}
                  review={props.reviews[index].childrenReview[childIndex]}
                  setReplyToComment={props.setReplyToComment}
                  fillInRef={props.fillInRef}
                />
              ))}
            </div>
          )}
        </div>
      ))}
      {props.reviewDisplay < props.reviews.length && (
        <div
          onClick={() => handleDisplayMoreReviews()}
          className="underline text-blue-600 cursor-pointer text-lg mx-auto hover_text-blue-900"
        >
          Hiển thị thêm đánh giá
        </div>
      )}
    </div>
  );
};

export default ReviewList;
