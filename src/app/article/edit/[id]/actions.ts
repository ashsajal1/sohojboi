"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Article } from "@prisma/client";
import { redirect } from "next/navigation";

export const editArticle = async (
  title: string,
  sections: { title: string; content: string }[],
  topicId: string,
  articleId: string
) => {
  try {
    const authorId = await auth().userId;

    // Begin a transaction to update article and sections
    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: {
        title,
        authorId: authorId!,
        topicId,
        deletedAt: null,
        sections: {
          deleteMany: {}, // Remove all previous sections
          create: sections.map((section, index) => ({
            title: section.title,
            content: section.content,
            position: index, // Keeps the new section order
            authorId: authorId!
          })),
        },
      },
      include: { sections: true }, // Optionally include sections in the response
    });

    return updatedArticle.id;
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
