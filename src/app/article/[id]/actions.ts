"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface Type {
  type: "comment" | "nestedComment";
}

export const createComment = async (
  articleId: string,
  content: string,
  commentType: Type,
  parentId?: string
) => {
  if (!articleId) {
    console.error("articleId is required");
    throw new Error("articleId is required");
  }

  let comment;
  try {
    const authorId = (await auth().userId) as string;
    console.log("authorId:", authorId);
    console.log("commentType:", commentType);
    console.log("parentId:", parentId);

    if (commentType.type === "comment") {
      comment = await prisma.comment.create({
        data: {
          parentId: null,
          articleId: articleId,
          content: content,
          authorId: authorId,
        },
      });
    } else if (commentType.type === "nestedComment") {
      if (!parentId) {
        console.error("parentId is required for nested comments");
        throw new Error("parentId is required for nested comments");
      }
      comment = await prisma.comment.create({
        data: {
          parentId: parentId,
          articleId: articleId,
          content: content,
          authorId: authorId,
        },
      });
    }

    console.log("Comment created:", comment);
    revalidatePath("/");
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};
