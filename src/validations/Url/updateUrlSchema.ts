import { z } from "zod";
import { createUrlSchema } from "./createUrlSchema";

export const updateUrlSchema = createUrlSchema.partial();
export type TUpdateUrl = z.infer<typeof updateUrlSchema>;
