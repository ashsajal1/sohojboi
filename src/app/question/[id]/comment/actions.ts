"use server";

import { CommentFormData, commentSchema } from "./type";

export const createComment = async (data: CommentFormData) => {
  // Validate the data using Zod
  try {
    const validatedData = commentSchema.parse(data);
    // Proceed with the validated data (e.g., saving to the database)
    console.log(validatedData);
  } catch (error) {
    return error;
  }
};