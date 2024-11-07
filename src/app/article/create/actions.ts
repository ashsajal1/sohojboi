"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const createArticle = async (
  title: string,
  sections: { title: string; content: string }[],
  topicId: string
) => {
  try {
    const authorId = await auth().userId;

    // Create the article with related sections
    const newArticle = await prisma.article.create({
      data: {
        title,
        authorId: authorId!,
        topicId,
        deletedAt: null,
        sections: {
          create: sections.map((section, index) => ({
            title: section.title,
            authorId: authorId!,
            content: section.content,
            position: index, // Assuming sections are ordered by position
          })),
        },
      },
      include: { sections: true }, // Optionally include sections in the response
    });

    redirect(`/article/${newArticle.id}`);
  } catch (error) {
    console.error("Error creating article:", error);
    throw new Error("Cannot create article with sections!");
  }
};
