"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export const deleteQuestion = async (questionId: string) => {
  try {
    const deletedQuestion = await prisma.question.delete({
      where: {
        id: questionId,
      },
    });
  } catch (error) {}

  redirect("/question");
};

export const updateQuestion = async (_: any, formData: FormData) => {
  const title = formData.get("title");
  const description = formData.get("description");
  const questionId = formData.get("questionId") as string;

  const updatedQuestion = await prisma.question.update({
    where: {
      id: questionId,
    },
    data: {
      questionTitle: title as string,
      questionDescription: description as string,
    },
  });

  // console.log(updatedQuestion);
  redirect(`/question/${questionId}`);
};
