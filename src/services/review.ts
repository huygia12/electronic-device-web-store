import { Review, ReviewFullJoin } from "@/types/model";
import { axiosInstanceWithoutAuthorize, reqConfig } from "@/config";
import { Nullable } from "@/utils/declare";

const reviewService = {
  apis: {
    getReviews: async (productID?: string): Promise<ReviewFullJoin[]> => {
      let path = "/reviews";
      if (productID) {
        path += `?productID=${productID}`;
      }
      try {
        const res = await axiosInstanceWithoutAuthorize.get<{
          info: ReviewFullJoin[];
        }>(path, reqConfig);
        return res.data.info;
      } catch (error) {
        console.error("Unexpected error:", error);
        return [];
      }
    },
  },
  getAverageRatingPoint: (reviews: Review[]): Nullable<number> => {
    let reviewCounter: number = 0;
    let total: number = 0;
    reviews.map((review) => {
      if (review.rating) {
        reviewCounter += review.rating;
        total += review.rating;
      }
    });
    if (reviewCounter === 0) return null;
    return total / reviewCounter;
  },
  addNewReview: (
    newReview: ReviewFullJoin,
    prevReviews: ReviewFullJoin[]
  ): ReviewFullJoin[] => {
    let newReviewList: ReviewFullJoin[];
    if (newReview.parentID) {
      newReviewList = prevReviews.map((review) => {
        if (review.reviewID === newReview.parentID) {
          review.childrenReview.push(newReview);
        }
        return review;
      });
    } else {
      newReviewList = [newReview, ...prevReviews];
    }
    return newReviewList;
  },
  deleteReview: (
    deletingReview: Review,
    prevReviews: ReviewFullJoin[]
  ): ReviewFullJoin[] => {
    let newReviewList: ReviewFullJoin[];
    if (deletingReview.parentID) {
      newReviewList = prevReviews.map((review) => {
        if (review.reviewID === deletingReview.parentID) {
          review.childrenReview = review.childrenReview.filter(
            (child) => child.reviewID !== deletingReview.reviewID
          );
        }
        return review;
      });
    } else {
      newReviewList = prevReviews.filter(
        (review) => review.reviewID !== deletingReview.reviewID
      );
    }
    return newReviewList;
  },
};

export default reviewService;
