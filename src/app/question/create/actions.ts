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

export const createQuestion = async (_: any, formData: FormData) => {
  const user = await currentUser();
  const title = formData.get("title");
  const description = formData.get("description");
  const topic = formData.get("topic");
  // console.log(topic);
  let newQuestion;
  const result = questionSchema.safeParse({ title, description });
  if (!result.success) {
    return result.error.format();
  }

  try {
    newQuestion = await prisma.question.create({
      data: {
        userId: user?.id as string,
        questionTitle: title as string,
        questionDescription: description as string,
        userFirstName: user?.firstName as string,
        userLastName: user?.lastName as string,
        userFullName: user?.fullName as string,
        topicId: topic as string,
      },
    });
  } catch (error) {
    logger.error(error);
    return { error: "An unexpected error occurred. Try again." };
  }

  redirect(`/question/${newQuestion.id}`);
};
