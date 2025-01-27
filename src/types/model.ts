import { InvoiceStatus, PaymentMethod, Role } from "@/types/enum";

export interface AttributeOption {
  optionID: string;
  optionValue: string;
  typeID: string;
}

export interface AttributeType {
  typeID: string;
  typeValue: string;
}

export interface Attribute {
  typeID: string;
  typeValue: string;
  attributeOptions: AttributeOption[];
}

export type ProductAttribute = AttributeOption & {
  attributeType: AttributeType;
};

export interface CartItem {
  productName: string;
  price: number;
  quantity: number;
  discount: number | null;
  productCode: string;
  color: string;
  storage: string | null;
  thump: string;
  productID: string;
  itemID: string;
  height: number;
  length: number;
  width: number;
  weight: number;
}

export interface Category {
  categoryID: string;
  categoryName: string;
  productQuantity?: number;
}

export interface Invoice {
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
  doneAt: Date | null;
  email: string;
  userName: string;
  note: string;
  paymentID: string;
  shippingFee: number;
  invoiceProducts: InvoiceProduct[];
}

//InvoiceProduct
export interface InvoiceProduct {
  discount: number | null;
  price: number;
  productName: string;
  quantity: number;
  invoiceID: string;
  productID: string;
  productCode: string;
  thump: string;
  color: string;
  storage: string | null;
  categoryName: string;
  providerName: string;
}

//ItemImage
interface ItemImage {
  imageID: string;
  source: string;
  itemID: string;
}

//ProductItem
export interface ProductItem {
  productID: string;
  itemID: string;
  thump: string;
  quantity: number;
  price: number;
  productCode: string;
  discount: number | null;
  color: string;
  storage: string | null;
  itemImages: ItemImage[];
}

//Product
export interface Product {
  productID: string;
  productName: string;
  description: string | null;
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

//Provider
export interface Provider {
  providerID: string;
  providerName: string;
  productQuantity?: number;
}

//Review
export interface Review {
  reviewID: string;
  reviewContent: string;
  rating: number | null;
  productID: string;
  userID: string;
  parentID: string | null;
  createdAt: Date;
}

export type ChildReviewFullJoin = Review & {
  // childrenReview: Review[];
  user: BaseUser;
  product: { productName: string };
};

export type ReviewFullJoin = Review & {
  childrenReview: ChildReviewFullJoin[];
  user: BaseUser;
  product: { productName: string };
};

//User
export type User = BaseUser & {
  phoneNumber: string | null;
  isBanned: boolean | null;
  createdAt: Date;
  updateAt: Date;
};

export interface BaseUser {
  userID: string;
  userName: string;
  email: string;
  avatar: string | null;
  role: Role;
}

//Slide
export interface Slide {
  url: string;
  ref: string | null;
  index: number;
}

//Store
export interface Store {
  storeID: string;
  storeName: string;
  description: string | null;
  address: string | null;
  phoneNumber: string | null;
  email: string | null;
  leftBanner: string | null;
  rightBanner: string | null;
}
