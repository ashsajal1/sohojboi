"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const deleteArticle = async (articleId: string) => {
  try {
    await Promise.all([
      prisma.comment.deleteMany({
        where: {
          articleId,
        },
      }),
      prisma.article.delete({
        where: {
          id: articleId,
        },
      }),
    ]);
    
    revalidatePath("/");
  } catch (error) {
    throw error;
  }
};
