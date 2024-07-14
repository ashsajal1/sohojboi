"use server";
import prisma from "@/lib/prisma";
import { QuestionFormData } from "./create-form";
import { revalidatePath } from "next/cache";

export const createChallengeQuestion = async (formData: QuestionFormData) => {
  try {
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

  revalidatePath('/')
};