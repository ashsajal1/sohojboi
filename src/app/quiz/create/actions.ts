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
      questionData.articleSection = {
        connect: { id: formData.articleSection },
      };
    }

    const question = await prisma.challengeQuestion.create({
      data: questionData,
    });
  } catch (error) {
    return error;
  }

  revalidatePath("/");
};

export const createManyQuestions = async (
  topic: string,
  questions: {
    content: string;
    options: string[];
    correctOption: string;
    hint: string | null;
    explanation: string | null;
  }[],
  article?: string
) => {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("User is not authorized!");
    }

    // Iterate and create each question individually
    for (const question of questions) {
      const options = [
        { content: question.correctOption, isCorrect: true },
        ...question.options.map((opt) => ({ content: opt, isCorrect: false })),
      ];

      // Define question data with conditional article connection
      const questionData: any = {
        content: question.content,
        options: { create: options },
        hint: question.hint,
        explanation: question.explanation,
        topic: { connect: { id: topic } },
      };

      if (article) {
        questionData.article = { connect: { id: article } };
      }

      // Create each question individually
      await prisma.challengeQuestion.create({
        data: questionData,
      });
    }

    // Optionally revalidate cache for updated data
    revalidatePath("/");
  } catch (error) {
    console.error("Error creating questions:", error);
    return error;
  }
};
