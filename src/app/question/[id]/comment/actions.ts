"use server";

import prisma from "@/lib/prisma";
import { CommentFormData, commentSchema } from "./type";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const createComment = async (
  data: CommentFormData,
  answerId: string
) => {
  // Validate the data using Zod
  try {
    const user = await auth();
    if (user.userId === null) {
      throw new Error("Unauthorized access");
    }
    const validatedData = commentSchema.parse(data);
    // Proceed with the validated data (e.g., saving to the database)
    await prisma.answerComment.create({
      data: {
        content: validatedData.content,
        answerId: answerId,
        userId: user.userId!,
        deletedAt: null,
      },
    });
  } catch (error) {
    return error;
  }

  revalidatePath("/");
};

export const getName = async (userId: string) => {
  try {
    const user = await clerkClient().users.getUser(userId);
    return user.fullName;
  } catch (err) {
    return { error: { message: "Cannot get user name" } };
  }
};

export const deleteAnsComment = async (commentId: string) => {
  try {
    await prisma.answerComment.update({
      where: {
        id: commentId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    revalidatePath("/");
  } catch (errors: any) {
    return errors.message;
  }
};

export const editAnsComment = async (data: CommentFormData, commentId: string) => {
  try {
    await prisma.answerComment.update({
      where: {
        id: commentId,
      },
      data: {
        content: data.content,
      },
    })

    revalidatePath("/");
  } catch (error:any) {
    return error;
  }
};
