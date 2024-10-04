// validation.ts
import { z } from "zod";

export const seriesSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title cannot exceed 100 characters"),
});
