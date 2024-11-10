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

    const options = formData.options.map((option) => ({
      content: option.content,
      isCorrect: false,
    }));

    const questionData: any = {
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
    };

    // Conditionally add articleSection connection if it exists
    if (formData.articleSection) {
      questionData.articleSection = { connect: { id: formData.articleSection } };
    }

    const question = await prisma.challengeQuestion.create({
      data: questionData,
    });

  } catch (error) {
    return error;
  }

  revalidatePath("/");
};
