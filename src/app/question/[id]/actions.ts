"use server";

import prisma from "@/lib/prisma";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { Answer, NotificationType, Question } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const getActorName = async (actorId: string): Promise<string> => {
  try {
    const actor = await clerkClient().users.getUser(actorId);
    return actor.fullName || `${actor.firstName} ${actor.lastName}`;
  } catch {
    redirect("/login");
  }
};

const findExistingUpvote = async (actorId: string, answerId: string) => {
  return await prisma.upvote.findUnique({
    where: {
      userId_answerId: {
        userId: actorId,
        answerId: answerId,
      },
    },
  });
};

const updateAnswerUpvoteCount = async (answerId: string, increment: boolean) => {
  await prisma.answer.update({
    where: { id: answerId },
    data: {
      upvoteCount: increment ? { increment: 1 } : { decrement: 1 },
    },
  });
};

const createNotification = async (userId: string, message: string, questionId?: string) => {
  await prisma.notification.create({
    data: {
      userId: userId,
      type: NotificationType.UPVOTE_ANSWER,
      message: message,
      questionId: questionId,
    },
  });
};

export const handleUpvote = async (
  answer: Answer,
  actorId: string,
  question: Question | null
) => {
  const actorName = await getActorName(actorId);
  const existingUpvote = await findExistingUpvote(actorId, answer.id);

  if (existingUpvote) {
    // Remove upvote
    await updateAnswerUpvoteCount(answer.id, false);
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
    // Add upvote
    await updateAnswerUpvoteCount(answer.id, true);
    await prisma.upvote.create({
      data: {
        userId: actorId,
        answerId: answer.id,
      },
    });

    if (actorId !== answer.userId) {
      const message = `${actorName} upvoted your answer to question "${question?.content}"`;
      await createNotification(answer.userId, message, question?.id);
    }
  }
};

export const deleteAnswer = async (answerId: string, questionId: string) => {
  try {
    const deletedQuestion = await prisma.answer.update({
      where: {
        id: answerId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  } catch (error) {}

  revalidatePath("/");
};

import z from "zod";

const questionSchema = z.object({
  answerText: z
    .string()
    .min(1, "Answer text is required")
    .max(5000, "Answer text must be 5000 characters or less"),
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
          deletedAt: null,
        },
      });

      if (user?.id !== questionUserId) {
        await Promise.all([
          await prisma.notification.create({
            data: {
              userId: (questionUserId as string) || "",
              message: `${user?.fullName} has answered your questions.`,
              type: NotificationType.ANSWER,
              answerId: answer.id,
              questionId: answer.questionId,
            },
          }),

          await prisma.profile.upsert({
            where: {
              clerkUserId: user?.id!,
            },
            update: {
              rewardCount: {
                increment: 50,
              },
            },
            create: {
              clerkUserId: user?.id!,
              rewardCount: 150,
              bio: "",
            },
          }),
        ]);
      }

      revalidatePath(`/question/${questionId}`);
    } catch (error) {
      return { error: `An unexpected error occurred. Try again.` };
    }
  }
};

export const updateAnswer = async (
  answerId: string,
  updatedAnswerText: string,
  questionId: string
) => {
  try {
    if (updatedAnswerText) {
      const updatedAnswer = await prisma.answer.update({
        where: {
          id: answerId,
        },
        data: {
          answer: updatedAnswerText as string,
        },
      });

      revalidatePath("/");
    }
  } catch (error) {}
};

export const increaseView = async (userId: string, questionId: string) => {
  await prisma.view.upsert({
    where: {
      user_question_unique: {
        userId: userId,
        questionId: questionId,
      },
    },
    update: {
      count: {
        increment: 1,
      },
    },
    create: {
      userId: userId,
      count: 1,
      questionId: questionId,
    },
  });
};

export const markSolution = async (questionId: string, answerId: string) => {
  try {
    // Step 1: Find the current solution for the question
    const currentSolution = await prisma.answer.findFirst({
      where: {
        questionId: questionId,
        isSolution: true,
      },
    });

    // Step 2: If a solution exists, update it to not be the solution
    if (currentSolution) {
      await prisma.answer.update({
        where: {
          id: currentSolution.id,
        },
        data: {
          isSolution: false,
        },
      });
    }

    // Step 3: Mark the new answer as the solution
    await prisma.answer.update({
      where: {
        id: answerId,
      },
      data: {
        isSolution: true,
      },
    });

    revalidatePath("/")
  } catch (error) {
    return error;
  }
};
