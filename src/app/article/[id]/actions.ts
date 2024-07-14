"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const createComment = async (articleId: string, content: string) => {
  try {
    const authorId = (await auth().userId) as string;
    await prisma.comment.create({
      data: {
        articleId: articleId,
        content: content,
        authorId: authorId,
      },
    });
    revalidatePath('/')
  } catch (error) {}

  
};
