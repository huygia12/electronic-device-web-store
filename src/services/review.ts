import { Review, ReviewFullJoin } from "@/types/model";
import { axiosInstance } from "@/config";

const reviewEndpoint = "/reviews";

const reviewService = {
  apis: {
    getReviews: async (productID?: string): Promise<ReviewFullJoin[]> => {
      let path = `${reviewEndpoint}`;
      if (productID) {
        path += `?productID=${productID}`;
      }
      const res = await axiosInstance.get<{
        info: ReviewFullJoin[];
      }>(path);
      return res.data.info;
    },
  },
  getAverageRatingPoint: (reviews: Review[]): number | null => {
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
