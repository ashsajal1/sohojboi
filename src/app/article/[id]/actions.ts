"use server";

import prisma from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Article, NotificationType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
    throw new Error("articleId is required");
  }

  let comment;
  try {
    const authorId = (await auth().userId) as string;

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

    revalidatePath("/");
  } catch (error) {
    throw error;
  }
};

export const handleUpvote = async (article: Article) => {
  const actorId = await auth().userId;
  if (!actorId) redirect("/login");
  const actor = await clerkClient().users.getUser(actorId!);
  const actorName = actor.fullName || `${actor.firstName} ${actor.lastName}`;

  const existingUpvote = await prisma.upvote.findUnique({
    where: {
      userId_articleId: {
        userId: actorId,
        articleId: article.id,
      },
    },
  });

  if (existingUpvote) {
    await prisma.upvote.delete({
      where: {
        userId_articleId: {
          userId: actorId,
          articleId: article.id,
        },
      },
    });

    await prisma.notification.deleteMany({
      where: {
        answerId: article.id,
        type: NotificationType.UPVOTE_ANSWER,
      },
    });


  } else {
    await prisma.upvote.create({
      data: {
        userId: actorId,
        articleId: article.id,
      },
    });

    const message = `${actorName} upvoted your article`;

    if (actorId !== article.authorId) {
      const notif = await prisma.notification.create({
        data: {
          userId: article.authorId,
          type: NotificationType.UPVOTE_ANSWER,
          message: message,
        },
      });
    }
  }

  revalidatePath("");
};

// export const getUpvoteCount = async () => {
//   const count = await prisma.upvote.count({

//   })
// }
