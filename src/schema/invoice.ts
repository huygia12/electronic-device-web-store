import z from "zod";

// const InvoiceSchema = z.object({
//   payment: z.string().default("COD"),
//   city: z.string().min(1, { message: "String cannot be blank" }),
//   ward: z.string().min(1, { message: "String cannot be blank" }),
//   province: z.string().min(1, { message: "String cannot be blank" }),
//   detailAddress: z.string().min(1, { message: "String cannot be blank" }),
//   phoneNumber: z.string().regex(new RegExp("^[0-9]+$")),
//   userID: z.string().min(1, { message: "String cannot be blank" }),
// });

// const InvoiceProductSchema = z.object({
//   quantity: z
//     .number({ message: "Not a number" })
//     .int({ message: "Not an integer number" })
//     .positive({ message: "Not a positive number" })
//     .finite({ message: "Not a finite number" })
//     .safe({ message: "Not in the int range" }),
//   productID: z.string().min(1, { message: "String cannot be blank" }),
// });

const ShippingSchema = z.object({
  email: z.string().email({ message: "Email không đúng định dạng!" }),
  phoneNumber: z
    .string()
    .regex(new RegExp("^[0-9]+$"), { message: "Số diện thoại không hợp lệ!" }),
  province: z.string().min(1, { message: "Chưa chọn tỉnh/thành phố!" }),
  district: z.string().min(1, { message: "Chưa chọn quận/huyện!" }),
  ward: z.string().min(1, { message: "Chưa chọn huyện/xã!" }),
});

type ShippingForm = z.infer<typeof ShippingSchema>;

export { ShippingSchema, type ShippingForm };
