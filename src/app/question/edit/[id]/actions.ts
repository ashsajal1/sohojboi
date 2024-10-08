"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export const deleteQuestion = async (questionId: string) => {
  try {
    const deletedQuestion = await prisma.question.update({
      where: {
        id: questionId,
      },
      data: {
        deletedAt: new Date(),
      }
    });

    // console.log(deletedQuestion);
    if (deletedQuestion) {
      redirect("/question");
    }
  } catch (error) {
    throw error
  }
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
      content: title as string,
      description: description as string,
    },
  });

  redirect(`/question/${questionId}`);
};


export const editQuestion = async (
  title: string,
  content: string,
  topicId: string,
  questionId: string
) => {
  console.log(topicId)
  const updatedQuestion = await prisma.question.update({
    where: {
      id: questionId,
    },
    data: {
      content: title,
      description: content,
      topicId: topicId,
    },
  });

  redirect(`/question/${questionId}`);
};
