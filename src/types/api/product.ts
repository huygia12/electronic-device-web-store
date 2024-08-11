import { Nullable, Optional } from "@/utils/declare";
import { ProductAttribute } from "./attribute";
import { Category } from "./category";
import { Provider } from "./provider";

type ProductParams = {
  id: string;
  categoryID: string;
  providerID: string;
};

interface ItemImage {
  imageID: string;
  source: string;
  itemID: string;
}

interface ProductItem {
  productID: string;
  itemID: string;
  thump: string;
  quantity: number;
  price: number;
  productCode: string;
  discount: Nullable<number>;
  color: string;
  storage: Nullable<string>;
  itemImages: ItemImage[];
}

interface ProductFullJoin {
  productID: string;
  productName: string;
  description: Nullable<string>;
  length: number;
  width: number;
  height: number;
  weight: number;
  warranty: number;
  category: Category;
  provider: Provider;
  productAttributes: {
    attributeOption: ProductAttribute;
  }[];
  productItems: ProductItem[];
}

interface ProductSummary {
  productID: string;
  productName: string;
  description: Nullable<string>;
  length: number;
  width: number;
  height: number;
  weight: number;
  warranty: number;
  category: Category;
  provider: Provider;
}

interface ProductInsertPayload {
  productName: string;
  description: Optional<string>;
  length: number;
  width: number;
  height: number;
  weight: number;
  warranty: number;
  categoryID: string;
  providerID: string;
  options: string[];
  productItems: ProductItemInsertPayload[];
}

interface ProductItemInsertPayload {
  thump: string;
  quantity: number;
  price: number;
  productCode: string;
  discount: number;
  color: string;
  storage: Optional<string>;
  itemImages: string[] | null;
}

interface ItemInputProps {
  thump: Nullable<File>;
  quantity: Nullable<number>;
  price: Nullable<number>;
  productCode: Nullable<string>;
  discount: Nullable<number>;
  color: Nullable<string>;
  storage: Nullable<string>;
  itemImages: Nullable<File[]>;
}

// interface ProductItemUpdate {
//   thump: File | string | null;
//   quantity: number | null;
//   price: number | null;
//   productCode: string | null;
//   discount: number | null;
//   colorName: string | null;
//   storageName: string | null;
//   images: File[] | string[] | null;
// }

export type {
  ProductFullJoin,
  ProductSummary,
  ProductAttribute,
  ProductItem,
  ProductParams,
  ItemInputProps,
  ProductInsertPayload,
};
