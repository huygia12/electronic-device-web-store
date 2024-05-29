export interface ProductAttributes {
  id: string;
  name: string;
  cate: string;
  tag: string[];
  quantity: number;
  price: number;
  discount: string;
  img: string;
  comments: number;
  rates: number;
  itemDetailID: string;
}

export interface BriefOrderAttributes {
  customer: string;
  id: string;
  createdAt: Date;
  products: number;
  total: number;
  status: string;
}

export interface ChartData {
  name: string;
  revenue: number;
}

export interface User {
  id: string;
  name: string;
  avt: string;
  createdAt: Date;
  phoneNumber: string;
  email: string;
  passwd: string;
}
