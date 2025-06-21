import { Category, Invoice, Provider, User } from "./model";

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

export interface ShippingService {
  data: {
    service_id: number;
    service_type_id: number;
  }[];
}

export interface ShippingAmount {
  data: {
    total: number;
  };
}

export interface ShippingTime {
  data: {
    leadtime: number;
  };
}

//Product
export interface ProductSummary {
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
  productItems: { thump: string; price: number; discount: number | null }[];
}

export interface ProductInsertionPayload {
  productName: string;
  description: string | undefined;
  length: number;
  width: number;
  height: number;
  weight: number;
  warranty: number;
  categoryID: string;
  providerID: string;
  options: string[];
  productItems: ProductItemInsertionPayload[];
}

export interface ProductItemInsertionPayload {
  thump: string;
  quantity: number;
  price: number;
  productCode: string;
  discount: number;
  color: string;
  storage: string | undefined;
  itemImages: string[] | null;
}

//User
export interface UserUpdatePayload {
  userName: string;
  email: string;
  phoneNumber: string | undefined;
  avatar?: string;
}

//Slide
export interface ImageToSlide {
  file: File;
  url: string;
  ref: string | null;
  index: number;
}

//Invoice
export interface InvoiceInsertionPayload {
  district: string;
  ward: string;
  province: string;
  phoneNumber: string;
  detailAddress: string;
  email: string;
  userID: string;
  note?: string;
  shippingFee: number;
  shippingTime: number;
  invoiceProducts: ProductInvoiceInsertionPayload[];
}

export interface ProductInvoiceInsertionPayload {
  productID: string;
  itemID: string;
  quantity: number;
}

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
  orders: Invoice[];
  invoiceStatistic: InvoiceStatistic[];
}

//Review
export interface ReviewInsertionPayload {
  reviewContent: string;
  rating: number | null;
  productID: string;
  userID: string;
  parentID: string | null;
}
