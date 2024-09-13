import { Nullable } from "@/utils/declare";
import { Role } from "@/utils/constants";

interface Review {
  reviewID: string;
  reviewContent: string;
  rating: Nullable<number>;
  productID: string;
  userID: string;
  parentID: Nullable<string>;
  createdAt: Date;
}

interface ReviewCreation {
  reviewContent: string;
  rating: Nullable<number>;
  productID: string;
  userID: string;
  parentID: Nullable<string>;
}

type ReviewFullJoinChild = Review & {
  childrenReview: Review[];
  user: {
    userID: string;
    userName: string;
    avatar: Nullable<string>;
    role: Role;
    createdAt: Date;
  };
  product: { productName: string };
};

type ReviewFullJoin = Review & {
  childrenReview: ReviewFullJoinChild[];
  user: {
    userID: string;
    userName: string;
    avatar: Nullable<string>;
    role: Role;
    createdAt: Date;
  };
  product: { productName: string };
};

export type { Review, ReviewFullJoin, ReviewFullJoinChild, ReviewCreation };
