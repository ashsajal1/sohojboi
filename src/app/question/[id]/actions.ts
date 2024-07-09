"use server";

import prisma from "@/lib/prisma";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
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

    await prisma.upvote.delete({
      where: {
        userId_answerId: {
          userId: actorId,
          answerId: answer.id,
        },
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

export const deleteAnswer = async (answerId: string, questionId: string) => {
  try {
    const deletedQuestion = await prisma.answer.delete({
      where: {
        id: answerId,
      },
    });
  } catch (error) {}

  redirect(`/question/${questionId}`);
};

import z from "zod";

const questionSchema = z.object({
  answerText: z
    .string()
    .min(1, "Answer text is required")
    .max(100, "Answer text must be 100 characters or less"),
});

export const createAnswer = async (_: any, formData: FormData) => {
  const user = await currentUser();
  const answerText = await formData.get("answerText");

  const result = questionSchema.safeParse({ answerText });
  if (!result.success) {
    return result.error.format();
  }

  const questionUserId = await formData.get("userId");
  const questionId = await formData.get("questionId");
  if (answerText) {
    try {
      const answer = await prisma.answer.create({
        data: {
          userId: (user?.id as string) || "",
          questionId: questionId as string,
          upvoteCount: 0,
          answer: answerText as string,
          userFirstName: user?.firstName as string,
          userLastName: user?.lastName as string,
          userFullName: user?.fullName as string,
        },
      });

      if (user?.id !== questionUserId) {
        const notif = await prisma.notification.create({
          data: {
            userId: (questionUserId as string) || "",
            message: `${user?.fullName} has answered your questions.`,
            type: NotificationType.ANSWER,
            answerId: answer.id,
            questionId: answer.questionId,
          },
        });
      }

      revalidatePath(`/question/${questionId}`);
    } catch (error) {
      return { error: `An unexpected error occurred. Try again.` };
    }
  }
};

export const updateAnswer = async (answerId: string,updatedAnswerText: string, questionId: string ) => {

  const updatedAnswer = await prisma.answer.update({
    where: {
      id: answerId,
    },
    data: {
      answer: updatedAnswerText as string,
    },
  });

  redirect(`/question/${questionId}`)
};
