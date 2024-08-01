import { z } from "zod";

const CategorySchema = z.string().min(1, { message: "String cannot be blank" });

export { CategorySchema };
