import { SchemaResponse } from "@/utils/constants";
import { z } from "zod";

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

const notBlankString = () =>
  z
    .string()
    .trim()
    .refine((value) => value !== "", {
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

const validateFile = () =>
  z
    .instanceof(File)
    .refine(
      (file) => ["image/jpeg", "image/jpg"].includes(file.type),
      SchemaResponse.IMAGE_FILE_INVALID
    )
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      SchemaResponse.IMAGE_FILE_OVER_FLOW
    );

const inputFormPreprocess = (schema: z.ZodTypeAny) =>
  z
    .preprocess((value) => (value === null ? undefined : value), schema)
    .nullable();

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

export type ProductInputFormProps = z.infer<typeof ProductSchema>;

export type ProductItemsFormProps = z.infer<typeof ProductItemsSchema>;

export type ProductAttributesFormProps = z.infer<
  typeof ProductAttributesSchema
>;

export { ProductSchema, ProductItemsSchema, ProductAttributesSchema };
