"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const createArticle = async (
  title: string,
  content: string,
  topicId: string
) => {
  try {
    const authorId = await auth().userId;
    const newArticle = await prisma.article.create({
      data: {
        title: title,
        content: content,
        authorId: authorId!,
      },
    });

    console.log(newArticle)
  } catch (error) {}
};
