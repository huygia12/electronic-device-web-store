import { SchemaResponse } from "@/utils/constants";
import z, { ZodString } from "zod";

const positiveSafeFloat = (errorMessage: string = SchemaResponse.INVALID) =>
  z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z
      .number({ message: errorMessage })
      .positive({ message: errorMessage })
      .safe({ message: errorMessage })
  );

const positiveSafeInteger = (errorMessage: string = SchemaResponse.INVALID) =>
  z
    .number({ message: errorMessage })
    .int({ message: errorMessage })
    .positive({ message: errorMessage })
    .safe({ message: errorMessage });

const notBlankString = (validate: ZodString = z.string()) =>
  validate.trim().refine((value) => value !== "", {
    message: SchemaResponse.REQUIRED,
  });

const validateFiles = () =>
  z
    .array(z.instanceof(File))
    .refine((files) =>
      files.every(
        (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
        SchemaResponse.IMAGE_FILE_INVALID
      )
    )
    .refine((files) =>
      files.every(
        (file) => file.size <= 5 * 1024 * 1024,
        SchemaResponse.IMAGE_FILE_OVER_FLOW
      )
    );

const validateOptionalFile = () =>
  z
    .instanceof(FileList)
    .refine(
      (file) =>
        file[0] ? ["image/jpeg", "image/jpg"].includes(file[0].type) : true,
      SchemaResponse.IMAGE_FILE_INVALID
    )
    .refine(
      (file) => (file[0] ? file[0].size <= 5 * 1024 * 1024 : true),
      SchemaResponse.IMAGE_FILE_OVER_FLOW
    );

const inputFormPreprocess = (schema: z.ZodTypeAny) =>
  z
    .preprocess((value) => (value === null ? undefined : value), schema)
    .nullable();

const UserSchema = z.object({
  userName: notBlankString(),
  avatar: inputFormPreprocess(validateOptionalFile()).optional(),
  phoneNumber: z
    .string()
    .refine((value) => {
      if (value.length > 0) {
        if (value.length > 10) return false;
        return /^[0-9]+$/.test(value);
      }
      return true;
    }, SchemaResponse.PHONE_INVALID)
    .optional(),
  email: z.string().email({ message: SchemaResponse.EMAIL_INVALID }),
});

const LoginSchema = z.object({
  email: z.string().email({ message: SchemaResponse.EMAIL_INVALID }),
  password: z.string().min(6, { message: SchemaResponse.PASSWORD_INVALID }),
});

const SignupSchema = z.object({
  userName: notBlankString(),
  email: z.string().email({ message: SchemaResponse.EMAIL_INVALID }),
  password: z.string().min(6, { message: SchemaResponse.PASSWORD_INVALID }),
  retypePassword: z
    .string()
    .min(6, { message: SchemaResponse.PASSWORD_INVALID }),
});

const ProductItemsSchema = z
  .array(
    z.object({
      thump: inputFormPreprocess(validateOptionalFile()),
      quantity: inputFormPreprocess(positiveSafeInteger()),
      price: inputFormPreprocess(positiveSafeInteger()),
      productCode: notBlankString(),
      discount: z.preprocess(
        (a) => parseFloat(z.string().parse(a)),
        z
          .number({ message: SchemaResponse.INVALID })
          .min(0, { message: SchemaResponse.MUST_BETWEEN_0_AND_100 })
          .max(100, { message: SchemaResponse.MUST_BETWEEN_0_AND_100 })
          .default(0)
      ),
      color: notBlankString(),
      storage: z.string().optional(),
      itemImages: inputFormPreprocess(validateFiles()),
    })
  )
  .refine((value) => {
    value.length > 0;
  }, SchemaResponse.AT_LEAST_ONE_PRODUCT);

const ProductAttributesSchema = z.array(
  z.object({
    typeID: notBlankString(),
    optionID: notBlankString(),
    optionValue: z.string(),
    typeValue: z.string(),
  })
);

const ProductSchema = z.object({
  productName: notBlankString(),
  description: z.string().trim().optional(),
  length: positiveSafeFloat(),
  width: positiveSafeFloat(),
  height: positiveSafeFloat(),
  weight: positiveSafeFloat(),
  warranty: positiveSafeFloat(),
  categoryID: notBlankString(),
  providerID: notBlankString(),
  productAttributes: ProductAttributesSchema.optional(),
  productItems: ProductItemsSchema,
});

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

const AttributeTypeSchema = z.object({
  typeValue: z.string().min(1, { message: "String cannot be blank" }),
});

export type ShippingForm = z.infer<typeof ShippingSchema>;

export type SignupFormProps = z.infer<typeof SignupSchema>;

export type LoginFormProps = z.infer<typeof LoginSchema>;

export type UserFormProps = z.infer<typeof UserSchema>;

export type ProductInputFormProps = z.infer<typeof ProductSchema>;

export type ProductItemsFormProps = z.infer<typeof ProductItemsSchema>;

export type ProductAttributesFormProps = z.infer<
  typeof ProductAttributesSchema
>;

export {
  UserSchema,
  LoginSchema,
  SignupSchema,
  ShippingSchema,
  AttributeTypeSchema,
  ProductSchema,
};
