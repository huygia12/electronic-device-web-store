import { Review } from "./review";

interface Product {
  productID: string;
  productName: string;
  description: string;
  height: number;
  weight: number;
  length: number;
  width: number;
  warranty: number;
  categoryName: string;
  providerName: string;
  attributes: {
    typeValue: string;
    optionValue: string;
  }[];
  items: ProductItem[];
  reviews: Review[];
}

type ProductParams = {
  id: string;
  cateID: string;
  provID: string;
};

interface ProductDetail {
  productID: string;
  productName: string;
  description: string | null;
  length: number;
  width: number;
  height: number;
  weight: number;
  warranty: number;
  categoryID: string | null;
  providerID: string | null;
  options: (string | null)[];
  items: ProductItem[];
}

interface ProductSummary {
  productID: string;
  productName: string;
  description: string;
  height: number;
  weight: number;
  length: number;
  width: number;
  warranty: number;
  categoryName: string;
  providerName: string;
}

interface ProductInsertPayload {
  productName: string;
  description: string | null;
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
  thump: string | null;
  quantity: number | null;
  price: number | null;
  productCode: string | null;
  discount: number | null;
  colorName: string | null;
  storageName: string | null;
  images: string[] | null;
}

interface ProductAttribute {
  typeID: string;
  typeValue: string;
  optionID: string;
  optionName: string;
}

interface ProductItem {
  itemID: string;
  thump: string;
  quantity: number;
  price: number;
  productCode: string;
  discount: number | null;
  colorName: string;
  storageName: string | null;
  images: string[];
}

interface ProductItemInput {
  thump: File | null;
  quantity: number | null;
  price: number | null;
  productCode: string | null;
  discount: number | null;
  colorName: string | null;
  storageName: string | null;
  images: File[] | null;
}

interface ProductItemUpdate {
  thump: File | string | null;
  quantity: number | null;
  price: number | null;
  productCode: string | null;
  discount: number | null;
  colorName: string | null;
  storageName: string | null;
  images: File[] | string[] | null;
}

interface LocalStorageProductItem {
  productID: string;
  itemID: string;
  quantity: number;
}

export type {
  Product,
  ProductDetail,
  ProductSummary,
  ProductInsertPayload,
  ProductItemInsertPayload,
  ProductAttribute,
  ProductItem,
  ProductItemInput,
  ProductItemUpdate,
  ProductParams,
  LocalStorageProductItem,
};
