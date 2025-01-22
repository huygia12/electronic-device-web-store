import { SchemaResponse } from "@/types/enum";
import z, { ZodString } from "zod";

const phoneNumberRegex = new RegExp("^[0-9]+$");

const positiveSafeFloat = (errorMessage: string = SchemaResponse.INVALID) =>
  z.preprocess(
    (value) => {
      if (typeof value === "string") {
        return parseFloat(value);
      }
      return value;
    },
    z
      .number({ message: errorMessage })
      .positive({ message: errorMessage })
      .safe({ message: errorMessage })
  );

const positiveSafeInteger = (errorMessage: string = SchemaResponse.INVALID) =>
  z.preprocess(
    (value) => {
      if (typeof value === "string") {
        return parseInt(value);
      }
      return value;
    },
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

const validateImageFile = (bypass: boolean = false) =>
  z.instanceof(FileList).superRefine((files, ctx) => {
    if (bypass) return;

    if (files.length === 0) {
      ctx.addIssue({
        path: [],
        message: SchemaResponse.AT_LEAST_ONE_IMAGE,
        code: z.ZodIssueCode.custom,
      });
      return;
    }

    const file = files[0];

    if (!file.type.includes("image")) {
      ctx.addIssue({
        path: [0],
        message: SchemaResponse.IMAGE_FILE_INVALID,
        code: z.ZodIssueCode.custom,
      });
      return;
    }

    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      ctx.addIssue({
        path: [0],
        message: SchemaResponse.IMAGE_FILE_OVER_FLOW,
        code: z.ZodIssueCode.custom,
      });
      return;
    }
  });

const inputFormPreprocess = (schema: z.ZodTypeAny) =>
  z
    .preprocess((value) => (value === null ? undefined : value), schema)
    .nullable();

const UserSchema = z.object({
  userName: notBlankString(),
  avatar: inputFormPreprocess(validateImageFile(true).optional()),
  phoneNumber: z
    .string()
    .refine((value) => {
      if (value.length > 0) {
        if (value.length > 10) return false;
        return phoneNumberRegex.test(value);
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
  avatar: inputFormPreprocess(validateImageFile().optional()),
  phoneNumber: z
    .string()
    .refine((value) => {
      if (value.length > 0) {
        if (value.length > 10) return false;
        return phoneNumberRegex.test(value);
      }
      return true;
    }, SchemaResponse.PHONE_INVALID)
    .optional(),
});

const ProductItemsInsertionSchema = z
  .array(
    z.object({
      thump: inputFormPreprocess(validateImageFile()),
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

const ProductInsertionSchema = z.object({
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
  productItems: ProductItemsInsertionSchema,
});

const ShippingSchema = z.object({
  email: z.string().email({ message: "Email không đúng định dạng!" }),
  phoneNumber: z
    .string()
    .regex(phoneNumberRegex, { message: "Số diện thoại không hợp lệ!" }),
  province: z.string().min(0, { message: "Chưa chọn tỉnh/thành phố!" }),
  district: z.string().min(0, { message: "Chưa chọn quận/huyện!" }),
  ward: z.string().min(0, { message: "Chưa chọn huyện/xã!" }),
  detailAddress: z.string({ message: "Chưa điền địa chỉ cụ thể!" }),
  note: z.string().optional(),
});

const AttributeTypeSchema = z.object({
  typeValue: z.string().min(0, { message: "String cannot be blank" }),
});

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
        (value) => {
          if (typeof value === "string") {
            return parseFloat(value);
          }
          return value;
        },
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

const ReviewInsertionSchema = z.object({
  reviewContent: notBlankString(),
});

export type ShippingFormProps = z.infer<typeof ShippingSchema>;

export type SignupFormProps = z.infer<typeof SignupSchema>;

export type LoginFormProps = z.infer<typeof LoginSchema>;

export type UserFormProps = z.infer<typeof UserSchema>;

export type ProductInsertionFormProps = z.infer<typeof ProductInsertionSchema>;

export type ProductItemsInsertionFormProps = z.infer<
  typeof ProductItemsInsertionSchema
>;

export type ProductAttributesFormProps = z.infer<
  typeof ProductAttributesSchema
>;

export type ProductUpdateFormProps = z.infer<typeof ProductUpdateSchema>;

export type ProductItemsUpdateFormProps = z.infer<
  typeof ProductItemsUpdateSchema
>;

export type ReviewInsertionFromProps = z.infer<typeof ReviewInsertionSchema>;

export {
  UserSchema,
  LoginSchema,
  SignupSchema,
  ShippingSchema,
  AttributeTypeSchema,
  ProductInsertionSchema,
  ProductUpdateSchema,
  ReviewInsertionSchema,
};
