"use server";

import prisma from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Article, Comment, NotificationType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// Define Zod schemas
const commentSchema = z.object({
  articleId: z.string().min(1, "articleId is required"),
  content: z.string().min(1, "Content cannot be empty"),
  commentType: z.object({
    type: z.enum(["comment", "nestedComment"]),
  }),
  parentId: z.string().optional(),
});

interface Type {
  type: "comment" | "nestedComment";
}

export const createComment = async (
  articleId: string,
  content: string,
  commentType: Type,
  parentId?: string
) => {
  // Validate input
  const parsed = commentSchema.safeParse({
    articleId,
    content,
    commentType,
    parentId,
  });
  if (!parsed.success) {
    throw new Error(parsed.error.errors.map((e) => e.message).join(", "));
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
          deletedAt: null,
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
          deletedAt: null,
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
        articleId: article.id,
        type: NotificationType.UPVOTE_ARTICLE,
      },
    });
  } else {
    await prisma.upvote.create({
      data: {
        userId: actorId,
        articleId: article.id,
      },
    });

    const message = `${actorName} upvoted your article of ${article.title}`;

    if (actorId !== article.authorId) {
      const notif = await prisma.notification.create({
        data: {
          userId: article.authorId,
          type: NotificationType.UPVOTE_ARTICLE,
          message: message,
          articleId: article.id,
        },
      });
    }
  }
};

export const deleteComment = async (commentId: string) => {
  try {
    await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    revalidatePath("/");
  } catch (error) {
    throw new Error("Cannot delete comment");
  }
};

export const editComment = async (commentId: string, value: string) => {
  try {
    await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content: value,
      },
    });

    revalidatePath("/");
  } catch (error) {
    throw new Error("Cannot edit comment");
  }
};

export const handleCommentUpvote = async (comment: Comment) => {
  const actorId = await auth().userId;
  if (!actorId) redirect("/login");
  const actor = await clerkClient().users.getUser(actorId!);
  const actorName = actor.fullName || `${actor.firstName} ${actor.lastName}`;

  const existingUpvote = await prisma.upvote.findUnique({
    where: {
      userId_commentId: {
        userId: actorId,
        commentId: comment.id,
      },
    },
  });

  if (existingUpvote) {
    await prisma.upvote.delete({
      where: {
        userId_commentId: {
          userId: actorId,
          commentId: comment.id,
        },
      },
    });

    await prisma.notification.deleteMany({
      where: {
        commentId: comment.id,
        type: NotificationType.UPVOTE_COMMENT,
      },
    });
  } else {
    await prisma.upvote.create({
      data: {
        userId: actorId,
        commentId: comment.id,
      },
    });

    const message = `${actorName} upvoted your comment of "${comment.content.slice(
      0,
      20
    )}..."`;

    if (actorId !== comment.authorId) {
      const notif = await prisma.notification.create({
        data: {
          userId: comment.authorId,
          type: NotificationType.UPVOTE_ARTICLE,
          message: message,
          articleId: comment.id,
        },
      });
    }
  }
};
