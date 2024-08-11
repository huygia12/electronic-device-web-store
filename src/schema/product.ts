import { z } from "zod";

const ProductSchema = z.object({
  productName: z.string().min(1, { message: "Không được bỏ trống!" }),
  warranty: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z
      .number({ message: "Không hợp lệ!" })
      .positive({ message: "Không hợp lệ!" })
      .safe({ message: "Không hợp lệ!" })
  ),
  description: z.string().optional(),
  categoryID: z.string().min(1, { message: "Không được bỏ trống!" }),
  providerID: z.string().min(1, { message: "Không được bỏ trống!" }),
  height: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z
      .number({ message: "Không hợp lệ!" })
      .positive({ message: "Không hợp lệ!" })
      .safe({ message: "Không hợp lệ!" })
  ),
  length: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z
      .number({ message: "Không hợp lệ!" })
      .positive({ message: "Không hợp lệ!" })
      .safe({ message: "Không hợp lệ!" })
  ),
  width: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z
      .number({ message: "Không hợp lệ!" })
      .positive({ message: "Không hợp lệ!" })
      .safe({ message: "Không hợp lệ!" })
  ),
  weight: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z
      .number({ message: "Không hợp lệ!" })
      .positive({ message: "Không hợp lệ!" })
      .safe({ message: "Không hợp lệ!" })
  ),
});

const ProductAttributeSchema = z.object({
  typeID: z.string().min(1, { message: "String cannot be blank" }),
  attributeValue: z.array(
    z.string().min(1, { message: "String cannot be blank" })
  ),
});

// const ItemSchema = z.object({
//   thump: z.string().min(1, { message: "String cannot be blank" }),
//   quantity: z
//     .number({ message: "Not a number" })
//     .int({ message: "Not an integer number" })
//     .positive({ message: "Not a positive number" })
//     .finite({ message: "Not a finite number" })
//     .safe({ message: "Not in the int range" }),
//   price: z
//     .number({ message: "Not a number" })
//     .positive({ message: "Not a positive number" })
//     .finite({ message: "Not a finite number" })
//     .safe({ message: "Not in the int range" }),
//   productCode: z.string().min(1, { message: "String cannot be blank" }),
//   color: z.string().min(1, { message: "String cannot be blank" }),
//   storage: z.string().optional(),
//   discount: z
//     .number({ message: "Not a number" })
//     .min(0, { message: "Must greater than 0" })
//     .max(100, { message: "Must less than 100" })
//     .default(0),
//   src: z.array(z.string().min(1, { message: "String cannot be blank" })),
// });

export type ProductInputFormProps = z.infer<typeof ProductSchema>;

export { ProductSchema, ProductAttributeSchema };
