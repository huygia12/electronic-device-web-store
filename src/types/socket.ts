import { InvoiceStatus } from "./enum";
import { Review, ReviewFullJoin } from "./model";
import { ReviewInsertionPayload } from "./payload";

//Events
export interface ClientEvents {
  "product:join": (payload: { productID: string }) => void;
  "product:leave": (payload: { productID: string }) => void;
  "user:join": (payload: { userID: string }) => void;
  "user:leave": (payload: { userID: string }) => void;
  "admin:join": () => void;
  "admin:leave": () => void;
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
  "invoice:new": () => void;
  "invoice:update-status": (payload: {
    userID: string;
    newStatus: InvoiceStatus;
  }) => void;
}

export interface ServerEvents {
  "review:create": (payload: { review: ReviewFullJoin }) => void;
  "review:delete": (payload: { review: Review }) => void;
  "user:ban": () => void;
  "invoice:new": (payload: { numberOfNewInvoices: number }) => void;
  "invoice:update-status": (payload: {
    numberOfNewInvoices: number;
    newStatus: InvoiceStatus;
  }) => void;
}

export interface SocketEmitError {
  status: number;
  message?: string;
  detail?: unknown;
}
