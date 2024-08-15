"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import z from "zod";
import { logger } from "@/logger";
const questionSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description must be 1000 characters or less"),
});

export const createQuestion = async (
  title: string,
  content: string,
  topicId: string
) => {
  const user = await currentUser();

  let newQuestion;
  const result = questionSchema.safeParse({ title, content, topicId });
  if (!result.success) {
    return result.error.format();
  }

  try {
    newQuestion = await prisma.question.create({
      data: {
        userId: user?.id as string,
        questionTitle: title as string,
        questionDescription: content,
        userFirstName: user?.firstName as string,
        userLastName: user?.lastName as string,
        userFullName: user?.fullName as string,
        topicId: topicId as string,
        deletedAt: null,
      },
    });
  } catch (error) {
    // logger.error(error);
    return { error: "An unexpected error occurred. Try again." };
  }

  redirect(`/question/${newQuestion.id}`);
};
