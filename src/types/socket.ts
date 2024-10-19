import { Review, ReviewFullJoin } from "./model";
import { ReviewInsertionPayload } from "./payload";

//Events
export interface ClientEvents {
  "product:join": (payload: { productID: string }) => void;
  "product:leave": (payload: { productID: string }) => void;
  "review:create": (
    payload: ReviewInsertionPayload,
    callback: (error: SocketEmitError) => void
  ) => void;
  "review:delete": (
    payload: { reviewID: string },
    callback: (error: SocketEmitError) => void
  ) => void;
  "user:ban": (
    payload: { userID: string; banned: boolean },
    callback: (error: SocketEmitError) => void
  ) => void;
}

export interface ServerEvents {
  "review:create": (payload: { review: ReviewFullJoin }) => void;
  "review:delete": (payload: { review: Review }) => void;
  "user:ban": (payload: { userID: string }) => void;
}

export interface SocketEmitError {
  status: number;
  message?: string;
  detail?: unknown;
}
