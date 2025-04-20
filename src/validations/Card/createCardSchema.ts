import { z } from "zod";

export const createCardSchema = z.object({
  title: z.string().min(1, "Title is required"),
  imageUrl: z.string().min(1, "Image URL is required").optional(),
  lastViewed: z.string().optional(),
  order: z.number().min(1, "Order must be greater than 0"),
  lastPage: z.number().min(1, "Order must be greater than 0").optional(),
});

export type TCreateCard = z.infer<typeof createCardSchema>;
