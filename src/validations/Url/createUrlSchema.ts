import { z } from "zod";

export const createUrlSchema = z.object({
  value: z.string().min(1, "URL value is required"),
  cardId: z.string().min(1, "Card ID is required"),
});

export type TCreateUrl = z.infer<typeof createUrlSchema>;
