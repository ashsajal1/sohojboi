"use server";

import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { NotificationType, Question } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const handleQuestionUpvote = async (
  question: Question,
  actorId: string
) => {
  let actor;
  let actorName;

  try {
    actor = await clerkClient().users.getUser(actorId);
    actorName = actor.fullName || `${actor.firstName} ${actor.lastName}`;
  } catch (error) {
    redirect("/login");
  }

  const existingUpvote = await prisma.upvote.findUnique({
    where: {
      userId_questionId: {
        userId: actorId,
        questionId: question.id,
      },
    },
  });

  if (existingUpvote) {
    await prisma.question.update({
      where: {
        id: question.id,
      },
      data: {
        upvoteCount: { decrement: 1 },
      },
    });

    await prisma.notification.deleteMany({
      where: {
        questionId: question.id,
        type: NotificationType.UPVOTE_QUESTION,
      },
    });

    await prisma.upvote.delete({
      where: {
        userId_questionId: {
          userId: actorId,
          questionId: question.id,
        },
      },
    });
  } else {
    await prisma.question.update({
      where: {
        id: question.id,
      },
      data: {
        upvoteCount: { increment: 1 },
      },
    });

    await prisma.upvote.create({
      data: {
        userId: actorId,
        questionId: question.id,
      },
    });

    const message = `${actorName} upvoted your question "${question?.content}"`;

    if (actorId !== question.userId) {
      const notif = await prisma.notification.create({
        data: {
          userId: question.userId,
          type: NotificationType.UPVOTE_QUESTION,
          message: message,
          questionId: question?.id,
        },
      });
    }
  }
};

export const getQuestions = async (page: number): Promise<Question[]> => {
  const skipSize = (page - 1) * 5;

  try {
    const newQuestions = await prisma.question.findMany({
      skip: skipSize,
      take: 5,
    });

    return newQuestions;
  } catch (error) {
    throw error;
  }
};
