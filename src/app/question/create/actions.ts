"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { questionSchema } from "./schema";

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
    return { error: "An unexpected error occurred. Try again." };
  }

  redirect(`/question/${newQuestion.id}`);
};
