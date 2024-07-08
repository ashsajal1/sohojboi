"use server";

import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { Answer, NotificationType, Question } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const handleUpvote = async (
  answer: Answer,
  actorId: string,
  question: Question | null
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
      userId_answerId: {
        userId: actorId,
        answerId: answer.id,
      },
    },
  });

  console.log(existingUpvote)

  if (existingUpvote) {
    await prisma.answer.update({
      where: {
        id: answer.id,
      },
      data: {
        upvoteCount: { decrement: 1 },
      },
    });

    await prisma.notification.deleteMany({
      where: {
        answerId: answer.id,
        type: NotificationType.UPVOTE_ANSWER,
      },
    });
  } else {
    await prisma.answer.update({
      where: {
        id: answer.id,
      },
      data: {
        upvoteCount: { increment: 1 },
      },
    });

    await prisma.upvote.create({
      data: {
        userId: actorId,
        answerId: answer.id,
      },
    });

    const message = `${actorName} upvoted your answer to question "${question?.questionTitle}"`;

    if (actorId !== answer.userId) {
      const notif = await prisma.notification.create({
        data: {
          userId: answer.userId,
          type: NotificationType.UPVOTE_ANSWER,
          message: message,
          questionId: question?.id,
        },
      });
    }
  }

  revalidatePath("");
};
