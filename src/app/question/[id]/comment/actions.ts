"use server";

import prisma from "@/lib/prisma";
import { CommentFormData, commentSchema } from "./type";
import { auth } from "@clerk/nextjs/server";

export const createComment = async (data: CommentFormData, answerId: string) => {
  // Validate the data using Zod
  try {
    const user = await auth();
    if(user.userId === null) {
        throw new Error("Unauthorized access");
    }
    const validatedData = commentSchema.parse(data);
    // Proceed with the validated data (e.g., saving to the database)
    await prisma.answerComment.create({
      data: {
        content: validatedData.content,
        answerId: answerId,
        userId: user.userId!,
      },
    })
  } catch (error) {
    return error;
  }
};