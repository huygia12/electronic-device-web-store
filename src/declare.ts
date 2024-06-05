import { z } from "zod";

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
  createdAt: string;
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
  createdAt: string;
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

// const ProductImage = z.object({
//   id: z.string(),
//   src: z.string(),
// });

const ItemSchema = z
  .object({
    id: z.string(),
    thump: z.string().min(1, { message: "String cannot be blank" }),
    quantity: z
      .number({ message: "Not a number" })
      .int({ message: "Not an integer number" })
      .positive({ message: "Not a positive number" })
      .finite({ message: "Not a finite number" })
      .safe({ message: "Not in the int range" }),
    price: z
      .number({ message: "Not a number" })
      .positive({ message: "Not a positive number" })
      .finite({ message: "Not a finite number" })
      .safe({ message: "Not in the int range" }),
    productCode: z.string().min(1, { message: "String cannot be blank" }),
    discount: z.number({ message: "Not a number" }).default(0),
    color: z.string().min(1, "String cannot be blank"),
    storage: z.string(),
  })
  .partial({ id: true, discount: true, storage: true });

const ProductSchema = z
  .object({
    id: z.string(),
    name: z.string().min(1, { message: "String cannot be blank" }),
    description: z.string(),
    height: z
      .number({ message: "Not a number" })
      .positive({ message: "Not an positive number" })
      .finite({ message: "Not an finite number" })
      .safe({ message: "Not in the int range" }),
    length: z
      .number({ message: "Not a number" })
      .positive({ message: "Not an positive number" })
      .finite({ message: "Not an finite number" })
      .safe({ message: "Not in the int range" }),
    width: z
      .number({ message: "Not a number" })
      .positive({ message: "Not an positive number" })
      .finite({ message: "Not an finite number" })
      .safe({ message: "Not in the int range" }),
    weight: z
      .number({ message: "Not a number" })
      .positive({ message: "Not an positive number" })
      .finite({ message: "Not an finite number" })
      .safe({ message: "Not in the int range" }),
    gurantee: z
      .number({ message: "Not a number" })
      .int({ message: "Not an integer number" })
      .positive({ message: "Not a positive number" })
      .finite({ message: "Not a finite number" })
      .safe({ message: "Not in the int range" }),
    categoryID: z.string().min(1, { message: "String cannot be blank" }),
    branchID: z.string().min(1, { message: "String cannot be blank" }),
  })
  .partial({ id: true, description: true });

type ItemPrototype = z.infer<typeof ItemSchema>;
type ProductPrototype = z.infer<typeof ProductSchema>;

export type Product = ProductPrototype & {
  items: ItemPrototype[];
};
