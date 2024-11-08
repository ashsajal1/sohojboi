"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Article } from "@prisma/client";
import { redirect } from "next/navigation";

export const editArticle = async (
  title: string,
  sections: { id?: string; title: string; content: string }[],
  topicId: string,
  articleId: string
) => {
  try {
    const authorId = await auth().userId;

    // Update the article title and topic
    const editedArticle = await prisma.article.update({
      where: { id: articleId },
      data: {
        title,
        topicId,
        authorId: authorId!,
      },
    });

    // Process each section to update existing ones or create new ones
    sections.forEach(async (section, index) => {
      if (section.id) {
        await prisma.articleSection.update({
          where: { id: section.id },
          data: {
            title: section.title,
            content: section.content,
            position: index,
          },
        });
      } else {
        await prisma.articleSection.create({
          data: {
            title: section.title,
            content: section.content,
            position: index,
            articleId: articleId,
            authorId: authorId!,
          },
        });
      }
    });
    

    return editedArticle.id;
  } catch (error) {
    console.error("Error editing article:", error);
    throw new Error("Cannot edit article with sections!");
  }
};


export const deleteArticle = async (article: Article) => {
  try {
    const currentUserId = await auth().userId;
    if (currentUserId !== article.authorId) {
      throw new Error("Unauthorized access!");
    }
    const deletedArticle = await prisma.article.update({
      where: {
        id: article.id,
      },
      data: {
        deletedAt: new Date(),
      }
    });

    if (deletedArticle) {
      redirect("/article");
    }
  } catch (error) {
    throw error;
  }
};
