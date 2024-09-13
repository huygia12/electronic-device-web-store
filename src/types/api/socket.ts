import { Review, ReviewCreation, ReviewFullJoin } from "./review";

interface ClientEvents {
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

interface ServerEvents {
  "review:create": (payload: { review: ReviewFullJoin }) => void;
  "review:delete": (payload: { review: Review }) => void;
}

interface SocketEmitError {
  status: number;
  message?: string;
  detail?: unknown;
}

export type { ClientEvents, ServerEvents, SocketEmitError };
