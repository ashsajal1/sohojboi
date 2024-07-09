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

    if(deletedQuestion) redirect('/question')
  } catch (error) {}
};
