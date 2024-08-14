"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const createArticle = async (
  title: string,
  content: string,
  topicId: string
) => {
  let newArticle;
  try {
    const authorId = await auth().userId;
    newArticle = await prisma.article.create({
      data: {
        title: title,
        content: content,
        authorId: authorId!,
        topicId: topicId,
        deletedAt: null,
      },
    });
  } catch (error) {
    throw new Error("Cannot create article!");
  }

  redirect(`/article/${newArticle.id}`);
};
