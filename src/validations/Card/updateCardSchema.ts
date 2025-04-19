import { z } from "zod";
import { createCardSchema } from "./createCardSchema";

export const updateCardSchema = createCardSchema.partial();

export type TUpdateCard = z.infer<typeof updateCardSchema>;
