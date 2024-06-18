import { z } from "zod";

export interface ChartData {
  name: string;
  revenue: number;
}

export interface Provider {
  providerID: string;
  providerName: string;
  products: number;
}

export interface Category {
  categoryID: string;
  categoryName: string;
  products: number;
}

export interface AttributeOption {
  optionID: string;
  optionValue: string;
}

export interface AttributeType {
  typeID: string;
  typeName: string;
  values: AttributeOption[];
}

export interface ProductItem {
  itemID: string;
  thump: string;
  quantity: number;
  price: number;
  productCode: string;
  discount: number;
  colorName: string;
  storageName: string;
  images: string[];
}

interface Review {
  reviewID: string;
  reviewContent: string;
  rating: number;
  createdAt: Date;
  accountName: string;
}

export interface Product {
  id: string;
  productName: string;
  description: string;
  height: number;
  weight: number;
  len: number;
  width: number;
  gurantee: number;
  categoryName: string;
  providerName: string;
  attributes: {
    typeName: string;
    optionValue: string;
  }[];
  items: ProductItem[];
  reviews: Review[];
}

export interface Account {
  accountName: string;
  email: string;
  accountID?: string;
  avt?: string;
  phoneNumber?: string;
  createdAt?: Date;
  editedAt?: Date;
}

export interface Invoice {
  invoiceID: string;
  status: string;
  payment: string;
  city: string;
  ward: string;
  province: string;
  phoneNumber: string;
  detailAddress: string;
  createdAt: Date;
  accountName: string;
  products: {
    quantity: number;
    price: number;
    productName: string;
    discount: number;
  }[];
}

export interface LocalStorageProductItem {
  productID: string;
  itemID: string;
  quantity: number;
}

export type ProductParams = {
  id: string;
};

export interface Error {
  success: boolean;
  message?: string;
}

export interface CartItem {
  id: string;
  productName: string;
  height: number;
  weight: number;
  len: number;
  width: number;
  itemID: string;
  thump: string;
  quantity: number;
  price: number;
  productCode: string;
  discount: number;
  colorName: string;
  storageName: string;
}

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

/** SCHEMA */
const ProductAttributeSchema = z.object({
  typeID: z.string().min(1, { message: "String cannot be blank" }),
  attributeValue: z.array(
    z.string().min(1, { message: "String cannot be blank" })
  ),
});

const AttributeTypeSchema = z.object({
  typeValue: z.string().min(1, { message: "String cannot be blank" }),
});

const ItemSchema = z
  .object({
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
    colorName: z.string().min(1, { message: "String cannot be blank" }),
    storageName: z.string(),
    discount: z
      .number({ message: "Not a number" })
      .min(0, { message: "Must greater than 0" })
      .max(100, { message: "Must less than 100" })
      .default(0),
    src: z.array(z.string().min(1, { message: "String cannot be blank" })),
  })
  .partial({ storageName: true });

const ProductSchema = z
  .object({
    productName: z.string().min(1, { message: "String cannot be blank" }),
    description: z.string(),
    height: z
      .number({ message: "Not a number" })
      .positive({ message: "Not an positive number" })
      .finite({ message: "Not an finite number" })
      .safe({ message: "Not in the int range" }),
    len: z
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
  .partial({
    description: true,
  });

const AccountSchema = z
  .object({
    accountName: z.string().min(1, { message: "String cannot be blank" }),
    avt: z.string().min(1, { message: "String cannot be blank" }),
    idBanned: z.boolean().default(false),
    phoneNumber: z.string().regex(new RegExp("^[0-9]+$")),
    email: z.string().email({ message: "Must be a valid email" }),
    passwd: z
      .string()
      .min(1, { message: "Must contain atleast 1 character" })
      .max(100, { message: "Must less than 100 characters" }),
  })
  .partial({ phoneNumber: true });

const InvoiceSchema = z.object({
  payment: z.string().default("COD"),
  city: z.string().min(1, { message: "String cannot be blank" }),
  ward: z.string().min(1, { message: "String cannot be blank" }),
  province: z.string().min(1, { message: "String cannot be blank" }),
  detailAddress: z.string().min(1, { message: "String cannot be blank" }),
  phoneNumber: z.string().regex(new RegExp("^[0-9]+$")),
  accountID: z.string().min(1, { message: "String cannot be blank" }),
});

const InvoiceProductSchema = z.object({
  quantity: z
    .number({ message: "Not a number" })
    .int({ message: "Not an integer number" })
    .positive({ message: "Not a positive number" })
    .finite({ message: "Not a finite number" })
    .safe({ message: "Not in the int range" }),
  productID: z.string().min(1, { message: "String cannot be blank" }),
});

const CategorySchema = z.string().min(1, { message: "String cannot be blank" });

const ProviderSchema = z.string().min(1, { message: "String cannot be blank" });

export {
  ProductAttributeSchema,
  AttributeTypeSchema,
  ItemSchema,
  ProductSchema,
  AccountSchema,
  InvoiceSchema,
  InvoiceProductSchema,
  CategorySchema,
  ProviderSchema,
};
