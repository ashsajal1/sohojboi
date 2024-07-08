"use server";

import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { NotificationType, Question } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const handleQuestionUpvote = async (
  question: Question,
  currentUpvoteCount: number,
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
  
  const count = currentUpvoteCount + 1;
  await prisma.question.update({
    where: {
      id: question.id,
    },
    data: {
      upvoteCount: count,
    },
  });

  const message = `${actorName} upvoted your question "${question?.questionTitle}"`;

  const notif = await prisma.notification.create({
    data: {
      userId: actorId,
      type: NotificationType.UPVOTE_QUESTION,
      message: message,
      questionId: question?.id,
    },
  });

  revalidatePath("");
};
