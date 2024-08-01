import { z } from "zod";

const ProviderSchema = z.string().min(1, { message: "String cannot be blank" });

export { ProviderSchema };
