import { Nullable, Optional } from "@/utils/declare";
import { Category, Provider } from "./model";

//Delivery from GHN apis
export interface Province {
  ProvinceID: number;
  ProvinceName: string;
}

export interface District {
  DistrictID: number;
  ProvinceID: number;
  DistrictName: string;
}

export interface Ward {
  WardCode: string;
  DistrictID: number;
  WardName: string;
}

export interface ServiceRes {
  data: {
    service_id: number;
    service_type_id: number;
  }[];
}

export interface ShippingAmountRes {
  data: {
    total: number;
  };
}

export interface ShippingTimeRes {
  data: {
    leadtime: number;
  };
}

//Product
export interface ProductSummary {
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
  productItems: { thump: string }[];
}

export interface ProductInsertPayload {
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

export interface ProductItemInsertPayload {
  thump: string;
  quantity: number;
  price: number;
  productCode: string;
  discount: number;
  color: string;
  storage: Optional<string>;
  itemImages: string[] | null;
}

export interface ProductItemInputProps {
  thump: Nullable<File>;
  quantity: Nullable<number>;
  price: Nullable<number>;
  productCode: Nullable<string>;
  discount: Nullable<number>;
  color: Nullable<string>;
  storage: Nullable<string>;
  itemImages: Nullable<File[]>;
}

//User
export interface UserUpdate {
  userName: string;
  email: string;
  phoneNumber: Optional<string>;
  avatar: Optional<string>;
}

//Slide
export interface SlideCreation {
  file: File;
  url: string;
  ref: Nullable<string>;
  index: number;
}
