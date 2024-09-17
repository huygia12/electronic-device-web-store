import { Review, ReviewFullJoin } from "@/types/model";
import { axiosInstanceWithoutAuthorize, reqConfig } from "@/config";
import axios from "axios";
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
        if (axios.isAxiosError(error)) {
          // AxiosError-specific handling
          console.error("Axios error:", error.message);
          if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
          }
        } else {
          // General error handling
          console.error("Unexpected error:", error);
        }
        return [];
      }
    },
  },
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
};

export default reviewService;
