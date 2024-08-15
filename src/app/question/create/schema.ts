import { z } from "zod";

export const questionSchema = z.object({
    title: z
      .string()
      .min(5, "Title must be at least 5 characters")
      .max(100, "Title must not exceed 100 characters")
      .nonempty("Title is required"),
    content: z
      .string()
      .min(10, "Content must be at least 10 characters")
      .max(10000, "Content must not exceed 10000 characters")
      .nonempty("Content is required"),
    topicId: z.string({ required_error: "Topic selection is required" }).nonempty("Topic selection is required"),
  });