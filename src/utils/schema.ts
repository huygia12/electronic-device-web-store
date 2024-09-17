import { SchemaResponse } from "@/types/enum";
import z, { ZodString } from "zod";

const positiveSafeFloat = (errorMessage: string = SchemaResponse.INVALID) =>
  z.preprocess(
    (value) => parseFloat(z.string().parse(value)),
    z
      .number({ message: errorMessage })
      .positive({ message: errorMessage })
      .safe({ message: errorMessage })
  );

const positiveSafeInteger = (errorMessage: string = SchemaResponse.INVALID) =>
  z.preprocess(
    (value) => parseInt(z.string().parse(value)),
    z
      .number({ message: errorMessage })
      .int({ message: errorMessage })
      .positive({ message: errorMessage })
      .safe({ message: errorMessage })
  );

const notBlankString = (validate: ZodString = z.string()) =>
  validate.trim().refine((value) => value !== "", {
    message: SchemaResponse.REQUIRED,
  });

const validateFiles = () =>
  z
    .instanceof(FileList)
    .refine((files) => files.length > 0, SchemaResponse.AT_LEAST_ONE_IMAGE)
    .refine((files) => {
      let checkImageExtension = true;
      Array.from(files).forEach((file) => {
        if (!file.type.includes("image")) {
          checkImageExtension = false;
        }
      });
      return checkImageExtension;
    }, SchemaResponse.IMAGE_FILE_INVALID)
    .refine((files) => {
      let checkImageSize = true;
      Array.from(files).forEach((file) => {
        if (file.size >= 5 * 1024 * 1024) {
          checkImageSize = false;
        }
      });
      return checkImageSize;
    }, SchemaResponse.IMAGE_FILE_OVER_FLOW);

const validateFile = (optional: boolean = false) =>
  z
    .instanceof(FileList)
    .refine(
      (files) => optional || files.length > 0,
      SchemaResponse.AT_LEAST_ONE_IMAGE
    )
    .refine(
      (files) => (files[0] ? files[0].type.includes("image") : true),
      SchemaResponse.IMAGE_FILE_INVALID
    )
    .refine(
      (files) => (files[0] ? files[0].size <= 5 * 1024 * 1024 : true),
      SchemaResponse.IMAGE_FILE_OVER_FLOW
    );

const inputFormPreprocess = (schema: z.ZodTypeAny) =>
  z
    .preprocess((value) => (value === null ? undefined : value), schema)
    .nullable();

const UserSchema = z.object({
  userName: notBlankString(),
  avatar: inputFormPreprocess(validateFile(true)).optional(),
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
  avatar: inputFormPreprocess(validateFile()).optional(),
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
});

const ProductItemsSchema = z
  .array(
    z.object({
      thump: inputFormPreprocess(validateFile()),
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
          .nullable()
      ),
      color: notBlankString(),
      storage: z.string().nullable(),
      itemImages: inputFormPreprocess(validateFiles()),
    })
  )
  .refine((value) => value.length > 0, SchemaResponse.AT_LEAST_ONE_PRODUCT);

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
    .regex(new RegExp("^[-1-9]+$"), { message: "Số diện thoại không hợp lệ!" }),
  province: z.string().min(0, { message: "Chưa chọn tỉnh/thành phố!" }),
  district: z.string().min(0, { message: "Chưa chọn quận/huyện!" }),
  ward: z.string().min(0, { message: "Chưa chọn huyện/xã!" }),
  detailAddress: z.string().optional(),
  note: z.string().optional(),
});

const AttributeTypeSchema = z.object({
  typeValue: z.string().min(0, { message: "String cannot be blank" }),
});

//TODO:
const validateUnionOfArrayStringAndFileList = () =>
  z
    .union([z.array(z.string()), z.instanceof(FileList)])
    .superRefine((value, ctx) => {
      // Skip further checks if the value is a string array
      if (
        Array.isArray(value) &&
        value.every((item) => typeof item === "string")
      ) {
        return;
      }

      if (value.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: SchemaResponse.AT_LEAST_ONE_IMAGE,
        });
      }

      let checking = true;
      Array.from(value as FileList).forEach((file) => {
        if (!file.type.includes("image")) {
          checking = false;
        }
      });
      if (!checking) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: SchemaResponse.IMAGE_FILE_INVALID,
        });
      }

      checking = true;
      Array.from(value as FileList).forEach((file) => {
        if (file.size >= 5 * 1024 * 1024) {
          checking = false;
        }
      });
      if (!checking) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: SchemaResponse.IMAGE_FILE_OVER_FLOW,
        });
      }
    });

const validateUnionOfStringAndFileList = () =>
  z.union([z.string(), z.instanceof(FileList)]).superRefine((value, ctx) => {
    // Skip further checks if the value is a string
    if (typeof value === "string") {
      return; // Skip validation if the value is a string
    }

    // If it's not a string (i.e., it's a FileList), continue with validations
    if (value.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: SchemaResponse.AT_LEAST_ONE_IMAGE,
      });
    }

    let checking = true;
    Array.from(value).forEach((file) => {
      if (!file.type.includes("image")) {
        checking = false;
      }
    });
    if (!checking) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: SchemaResponse.IMAGE_FILE_INVALID,
      });
    }

    checking = true;
    Array.from(value).forEach((file) => {
      if (file.size >= 5 * 1024 * 1024) {
        checking = false;
      }
    });
    if (!checking) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: SchemaResponse.IMAGE_FILE_OVER_FLOW,
      });
    }
  });

const ProductItemsUpdateSchema = z
  .array(
    z.object({
      thump: inputFormPreprocess(validateUnionOfStringAndFileList()),
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
          .nullable()
      ),
      color: notBlankString(),
      storage: z.string().nullable(),
      itemImages: inputFormPreprocess(validateUnionOfArrayStringAndFileList()),
    })
  )
  .refine((value) => value.length > 0, SchemaResponse.AT_LEAST_ONE_PRODUCT);

const ProductUpdateSchema = z.object({
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
  productItems: ProductItemsUpdateSchema,
});

const ReviewCreationSchema = z.object({
  reviewContent: notBlankString(),
});

const ProductSearchingSchema = z.object({
  productName: z.string().nullable(),
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

export type ProductUpdateFormProps = z.infer<typeof ProductSchema>;

export type ProductItemsUpdateFormProps = z.infer<
  typeof ProductItemsUpdateSchema
>;

export type ReviewCreationFromProps = z.infer<typeof ReviewCreationSchema>;

export type ProductSearchingFormProps = z.infer<typeof ProductSearchingSchema>;

export {
  UserSchema,
  LoginSchema,
  SignupSchema,
  ShippingSchema,
  AttributeTypeSchema,
  ProductSchema,
  ProductUpdateSchema,
  ReviewCreationSchema,
  ProductSearchingSchema,
};
