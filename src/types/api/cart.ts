import { Nullable } from "@/utils/declare";

interface CartItem {
  productName: string;
  price: number;
  quantity: number;
  discount: Nullable<number>;
  productCode: string;
  color: string;
  storage: Nullable<string>;
  thump: string;
  productID: string;
  itemID: string;
  height: number;
  length: number;
  width: number;
  weight: number;
}

export type { CartItem };
