import { InvoiceStatus, PaymentMethod, Role } from "@/types/enum";
import { Nullable } from "@/utils/declare";

//Attributes
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

//Cart
export interface CartItem {
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

//Category
export interface Category {
  categoryID: string;
  categoryName: string;
  productQuantity?: number;
}

//Invoice
export interface Invoice {
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

export interface InvoiceProduct {
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

export interface InvoiceFullJoin {
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

//Product
interface ItemImage {
  imageID: string;
  source: string;
  itemID: string;
}

export interface ProductItem {
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

export interface ProductFullJoin {
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
  rating: Nullable<number>;
  productID: string;
  userID: string;
  parentID: Nullable<string>;
  createdAt: Date;
}

export type ReviewFullJoinChild = Review & {
  childrenReview: Review[];
  user: {
    userID: string;
    userName: string;
    avatar: Nullable<string>;
    role: Role;
    createdAt: Date;
  };
  product: { productName: string };
};

export type ReviewFullJoin = Review & {
  childrenReview: ReviewFullJoinChild[];
  user: {
    userID: string;
    userName: string;
    avatar: Nullable<string>;
    role: Role;
    createdAt: Date;
  };
  product: { productName: string };
};

//Statistic
export interface InvoiceStatistic {
  date: string; //must be ISO 8601 format
  order: number;
  revenue: number;
}

export interface Statistic {
  totalUsers: number;
  totalProducts: number;
  invoices: {
    today: number;
    yesterday: number;
  };
  revenue: {
    today: number;
    yesterday: number;
  };
  newUsers: User[];
  orders: InvoiceFullJoin[];
  invoiceStatistic: InvoiceStatistic[];
}

//User
export interface User {
  userID: string;
  userName: string;
  email: string;
  phoneNumber: Nullable<string>;
  avatar: Nullable<string>;
  isBanned: Nullable<boolean>;
  role: Role;
  createdAt: Date;
  updateAt: Date;
}

export interface AuthUser {
  userID: string;
  userName: string;
  email: string;
  avatar: Nullable<string>;
  role: Role;
  exp: string;
}

//Store
export interface Slide {
  slideID: string;
  url: string;
  ref: Nullable<string>;
  storeID: string;
  index: number;
}

export interface Store {
  storeID: string;
  storeName: string;
  description: Nullable<string>;
  address: Nullable<string>;
  phoneNumber: Nullable<string>;
  email: Nullable<string>;
  leftBanner: Nullable<string>;
  rightBanner: Nullable<string>;
}

export type StoreFullJoin = Store & {
  slideShows: Slide[];
};
