"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Article } from "@prisma/client";
import { redirect } from "next/navigation";

export const editArticle = async (
  title: string,
  content: string,
  topicId: string,
  articleId: string,
) => {
  let editedArticle;
  try {
    const authorId = await auth().userId;
    editedArticle = await prisma.article.update({
      where: {
        id: articleId,
      },
      data: {
        title: title,
        content: content,
        authorId: authorId!,
        topicId: topicId,
      },
    });
  } catch (error) {
    throw new Error("Cannot edit article!");
  }

  redirect(`/article/${editedArticle.id}`);
};

export const deleteArticle = async (article:Article) => {
  try {
    const deletedArticle = await prisma.article.delete({
      where: {
        id: article.id
      }
    })

    if(deletedArticle) {
      redirect('/article')
    }
  } catch (error) {
    throw error;
  }
}