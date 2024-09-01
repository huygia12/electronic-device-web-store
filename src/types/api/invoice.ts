import { Nullable } from "@/utils/declare";
import { CartItem } from "./cart";
import { InvoiceStatus, PaymentMethod } from "@/utils/constants";

interface Invoice {
  invoiceID: string;
  status: string;
  payment: string;
  city: string;
  ward: string;
  province: string;
  phoneNumber: string;
  detailAddress?: string;
  createdAt: Date;
  userName: string;
  products: CartItem[];
}

interface InvoiceProduct {
  discount: Nullable<number>;
  price: number;
  productName: string;
  quantity: number;
  invoiceID: string;
  productID: string;
  productCode: string;
  thump: string;
  color: string;
  storage: Nullable<string>;
  categoryName: string;
  providerName: string;
}

interface InvoiceFullJoin {
  invoiceID: string;
  status: InvoiceStatus;
  payment: PaymentMethod;
  district: string;
  ward: string;
  province: string;
  phoneNumber: string;
  detailAddress: string;
  userID: string;
  createdAt: Date;
  email: string;
  userName: string;
  note: string;
  paymentID: string;
  shippingFee: number;
  invoiceProducts: InvoiceProduct[];
}

export type { Invoice, InvoiceFullJoin };
