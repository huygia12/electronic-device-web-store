import { Review, ReviewFullJoin } from "@/types/api";

const reviewService = {
  deleteReview: (
    reviews: ReviewFullJoin[],
    deletingReview: Review
  ): ReviewFullJoin[] => {
    return reviews.filter(
      (review) => review.reviewID !== deletingReview.reviewID
    );
  },
  deleteReviewChild: (
    reviews: ReviewFullJoin[],
    deletingReview: Review
  ): ReviewFullJoin[] => {
    return reviews.map((review) => {
      if (review.reviewID === deletingReview.parentID) {
        review.childrenReview = review.childrenReview.filter(
          (child) => child.reviewID !== deletingReview.reviewID
        );
      }
      return review;
    });
  },
};

export default reviewService;
