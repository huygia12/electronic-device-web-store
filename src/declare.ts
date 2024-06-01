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

export interface Category {
  id: string;
  name: string;
  products: number;
}

export interface Provider {
  id: string;
  name: string;
  products: number;
}

export interface AdminNavItem {
  name: string;
  url: string;
  icon: JSX.Element;
  hasChild: boolean;
  children: AdminNavSubItem[];
}

export interface AdminNavSubItem {
  name: string;
  url: string;
  icon: JSX.Element;
}

export interface ProductAttributeValue {
  id: string;
  name: string;
}

export interface ProductAttribute {
  id: string;
  name: string;
  values: ProductAttributeValue[];
}

export interface ProductItem {
  id: string;
  thump: string;
  quantity: number;
  price: number;
  prior: boolean;
  productCode: string;
  discount: number;
  color: string;
  storage: string;
  productImage: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  height: number;
  length: number;
  width: number;
  weight: number;
  gurantee: number;
  category: string;
  branch: string;
  productItem: ProductItem[];
}
