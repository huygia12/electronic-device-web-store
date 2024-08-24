import z from "zod";

const ShippingSchema = z.object({
  email: z.string().email({ message: "Email không đúng định dạng!" }),
  phoneNumber: z
    .string()
    .regex(new RegExp("^[0-9]+$"), { message: "Số diện thoại không hợp lệ!" }),
  province: z.string().min(1, { message: "Chưa chọn tỉnh/thành phố!" }),
  district: z.string().min(1, { message: "Chưa chọn quận/huyện!" }),
  ward: z.string().min(1, { message: "Chưa chọn huyện/xã!" }),
  detailAddress: z.string().optional(),
  note: z.string().optional(),
});

type ShippingForm = z.infer<typeof ShippingSchema>;

export { ShippingSchema, type ShippingForm };
