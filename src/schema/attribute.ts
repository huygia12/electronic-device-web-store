import { z } from "zod";

const AttributeTypeSchema = z.object({
  typeValue: z.string().min(1, { message: "String cannot be blank" }),
});

export { AttributeTypeSchema };
