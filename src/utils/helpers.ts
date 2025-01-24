import { InvoiceStatus, PaymentMethod } from "@/types/enum";
import { ActionFunctionArgs, ParamParseKey, Params } from "react-router-dom";

export interface Args extends ActionFunctionArgs {
  params: Params<ParamParseKey<string>>;
}

const rowsPerPage = 10;

const getImageUrl = (file: File): string | undefined => {
  let url: string | undefined;
  try {
    url = URL.createObjectURL(file);
  } catch {
    console.warn("failed to create url from file");
  }
  return url;
};

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  const padZero = (num: number) => String(num).padStart(2, "0");

  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  const seconds = padZero(date.getSeconds());

  const day = padZero(date.getDate());
  const month = padZero(date.getMonth() + 1); // Months are zero-indexed
  const year = date.getFullYear();

  return `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
};

const getDayOfMonthString = (date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;

  return `${day}/${month}`;
};

const getDateString = (date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day} - T${month}, ${year}`;
};

const getRatioString = (num1: number, num2: number): string => {
  const ratio = ((Math.abs(num1 - num2) / num2) * 100).toFixed(2);
  return num1 < num2 ? `- ${ratio}%` : `+ ${ratio}%`;
};

const getNumberGapString = (num1: number, num2: number): string => {
  const gap: number = Math.abs(num1 - num2);
  return num1 < num2 ? `- ${gap}%` : `+ ${gap}%`;
};

const retrieveImageUrl = (image: unknown): string => {
  if (typeof image === "string") {
    return image;
  } else if (image instanceof File) {
    return URL.createObjectURL(image);
  }
  throw new Error("Invalid image!");
};

const getDiscount = (discount: number | null): number => {
  return discount ?? 0;
};

const isDiscount = (discount: number | null): boolean => {
  return discount !== null && discount > 0;
};

const applyDiscount = (price: number, discount: number | null): number => {
  if (!discount) return price;
  return price * (1 - discount / 100);
};

const convertMiliSecToDays = (miliSec: number): number => {
  return Math.round(miliSec / (1000 * 60 * 60 * 24));
};

const getPages = (rows: number, limit?: number): number => {
  return Math.ceil(rows / (limit || rowsPerPage));
};

const getTheFollowingDay = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
};

const getInvoiceStatus = (status: InvoiceStatus): string => {
  let invoiceStatus: string;
  if (status === InvoiceStatus.NEW) invoiceStatus = "Đang Chờ Duyệt";
  else if (status === InvoiceStatus.PAYMENT_WAITING)
    invoiceStatus = "Đang Chờ Thanh Toán";
  else if (status === InvoiceStatus.SHIPPING) invoiceStatus = "Đang Giao Hàng";
  else if (status === InvoiceStatus.DONE)
    invoiceStatus = "Giao Hàng Thành Công";
  else invoiceStatus = "Đã Bị Hủy";

  return invoiceStatus;
};

const getInvoicePaymentMethod = (method: PaymentMethod): string => {
  let paymentMethod: string;
  if (method === PaymentMethod.BANKING)
    paymentMethod = "Thanh Toán Bằng Chuyển Khoản";
  else if (method === PaymentMethod.COD)
    paymentMethod = "Thanh Toán Khi Nhận Hàng";
  else paymentMethod = "Chưa Thanh Toán";

  return paymentMethod;
};

export {
  formatDateTime,
  getRatioString,
  getNumberGapString,
  getDayOfMonthString,
  getDateString,
  retrieveImageUrl,
  getDiscount,
  isDiscount,
  applyDiscount,
  convertMiliSecToDays,
  getPages,
  getTheFollowingDay,
  getImageUrl,
  getInvoiceStatus,
  getInvoicePaymentMethod,
};
