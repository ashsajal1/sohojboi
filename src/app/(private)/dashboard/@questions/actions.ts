"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const deleteQuestion = async (id: string) => {
  try {

    await prisma.question.update({
      where: { id: id },
      data: {
        deletedAt: new Date(),
      }
    });

    revalidatePath("/");
  } catch (err: any) {
    throw new Error("Cannot delete question!");
  }
};
