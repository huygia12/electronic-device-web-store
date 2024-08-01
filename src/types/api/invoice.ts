import { CartItem } from "./cart";

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

export type { Invoice };
