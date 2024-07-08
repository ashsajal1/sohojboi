"use server";

import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { NotificationType, Question } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// export const createAnswer = async (questionId: string, answerText: string) => {
//   const answer = await prisma.answer.create({
//     data: {
//       userId: "123",
//       questionId: questionId,
//       upvoteCount: 0,
//       answer: answerText,
//     },
//   });
// };

export const handleUpvote = async (
  answerId: string,
  currentUpvoteCount: number,
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

  const count = currentUpvoteCount + 1;
  await prisma.answer.update({
    where: {
      id: answerId,
    },
    data: {
      upvoteCount: count,
    },
  });

  const message = `${actorName} upvoted your answer to question "${question?.questionTitle}"`;

  const notif = await prisma.notification.create({
    data: {
      userId: actorId,
      type: NotificationType.UPVOTE_ANSWER,
      message: message,
      questionId: question?.id,
    },
  });

  revalidatePath("");
};
