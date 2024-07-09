"use server";

import prisma from "@/lib/prisma";

export const deleteQuestion = async (questionId: string) => {
  try {
    await prisma.question.delete({
      where: {
        id: questionId,
      },
    });
  } catch (error) {}
};
