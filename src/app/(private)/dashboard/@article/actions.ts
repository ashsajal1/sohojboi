"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const deleteArticle = async (articleId: string) => {
  try {
   await prisma.article.update({
    where: {
      id: articleId,
    },
    data :{
      deletedAt: new Date(),
    }
   })
    
    revalidatePath("/");
  } catch (error) {
    throw error;
  }
};
