"use server";
import prisma from "@/lib/prisma";
import { QuestionFormData } from "./create-form";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

export const createChallengeQuestion = async (formData: QuestionFormData) => {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("User is not authorized!");
    }
    const options = formData.options.map((option) => {
      return {
        content: option.content,
        isCorrect: false,
      };
    });
    const question = await prisma.challengeQuestion.create({
      data: {
        content: formData.content,
        topic: { connect: { id: formData.topic } },
        article: { connect: { id: formData.article } },
        deletedAt: null,
        options: {
          create: [
            { content: formData.correctOption, isCorrect: true },
            ...options,
          ],
        },
      },
    });
  } catch (error) {
    return error;
  }

  revalidatePath("/");
};
