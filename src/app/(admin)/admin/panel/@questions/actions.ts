"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const deleteQuestion = async (id: string) => {
  try {
    await prisma.answerOption.deleteMany({
      where: { challengeQuestionId: id },
    });

    await prisma.challengeQuestion.delete({
      where: { id: id },
    });

    revalidatePath("/");
  } catch (err: any) {
    throw new Error("Cannot delete question!");
  }
};
