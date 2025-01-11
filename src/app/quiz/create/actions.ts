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

export async function createManyQuestions(topicId: string, questions: any[], articleId?: string) {
  try {
    for (const question of questions) {
      // Create ChallengeQuestion first
      const createdQuestion = await prisma.challengeQuestion.create({
        data: {
          content: question.content,
          hint: question.hint,
          explanation: question.explanation,
          topic: { connect: { id: topicId } },
          ...(articleId && { article: { connect: { id: articleId } } }),
        },
      });

      // Create associated AnswerOptions
      // const options = [
      //   ...question.options.map((opt: {text:string, isCorrect: boolean}) => ({ content: opt.text, isCorrect: opt.isCorrect })),
      // ];

      console.log(question.options)
      for (const option of question.options) {
        await prisma.answerOption.create({
          data: {
            content: option.text,
            isCorrect: option.isCorrect,
            challengeQuestionId: createdQuestion.id, // Associate with the created ChallengeQuestion
          },
        });
      }
    }

    console.log("Questions and options created successfully!");
  } catch (error) {
    console.error("Error creating questions:", error);
  } 
}
