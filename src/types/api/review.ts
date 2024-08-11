interface Review {
  reviewID: string;
  reviewContent: string;
  productID: string;
  userID: string;
  rating: number;
  createdAt: Date;
  userName: string;
}

export type { Review };
