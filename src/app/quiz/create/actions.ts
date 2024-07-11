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

// const question1 = await prisma.challengeQuestion.create({
//     data: {
//       content: "What is 2 + 2?",
//       topic: { connect: { id: topic.id } },
//       chapter: { connect: { id: chapter.id } },
//       options: {
//         create: [
//           { content: "3", isCorrect: false },
//           { content: "4", isCorrect: true },
//           { content: "5", isCorrect: false },
//         ],
//       },
//       tags: {
//         create: [
//           { tag: { connect: { id: tag1.id } } },
//           { tag: { connect: { id: tag2.id } } },
//         ],
//       },
//     },
//   });
