import { Nullable } from "@/utils/declare";
import { Review, ReviewFullJoin } from "./model";

//Events
export interface ClientEvents {
  "product:join": (payload: { productID: string }) => void;
  "product:leave": (payload: { productID: string }) => void;
  "review:create": (
    payload: ReviewCreation,
    callback: (error: SocketEmitError) => void
  ) => void;
  "review:delete": (
    payload: { reviewID: string },
    callback: (error: SocketEmitError) => void
  ) => void;
}

export interface ServerEvents {
  "review:create": (payload: { review: ReviewFullJoin }) => void;
  "review:delete": (payload: { review: Review }) => void;
}

export interface SocketEmitError {
  status: number;
  message?: string;
  detail?: unknown;
}

//Payload
export interface ReviewCreation {
  reviewContent: string;
  rating: Nullable<number>;
  productID: string;
  userID: string;
  parentID: Nullable<string>;
}
