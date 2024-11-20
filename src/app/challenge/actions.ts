"use server";

import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { Competition, NotificationType, Topic } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const createCompetition = async (
  challangeeId: string,
  challangerId: string,
  questionIds: string[],
  challengerScore: number
) => {
  try {
    const challengerName = (await clerkClient().users.getUser(challangerId))
      .fullName as string | "";
    const challengeeName = (await clerkClient().users.getUser(challangeeId))
      .fullName as string | "";

    const competition = await prisma.competition.create({
      data: {
        title: `${challengerName} vs ${challengeeName}`,
        description: `A competition between ${challengerName} and ${challengeeName}`,
        questionIds: questionIds,
        challengerId: challangerId || "",
        challengeeId: challangeeId || "",
        challengerScore: challengerScore,
        status: "pending",
      },
    });

    const notif = await prisma.notification.create({
      data: {
        userId: challangeeId,
        message: `${challengerName} challenged you in a quiz!`,
        type: NotificationType.CHALLENGE,
        competitionId: competition.id,
      },
    });
  } catch (error) {
    throw error;
  }

  // console.log(notif)
};

export const declineChallange = async (competition: Competition) => {
  try {
    const user = await clerkClient().users.getUser(competition.challengeeId);
    await Promise.all([
      await prisma.competition.update({
        where: {
          id: competition.id,
        },
        data: {
          status: "declined",
        },
      }),
      await prisma.notification.create({
        data: {
          userId: competition.challengerId,
          message: `${user.fullName} declined your challenge!`,
          type: NotificationType.CHALLENGE,
          competitionId: competition.id,
        },
      }),
    ]);
  } catch (error) {
    return { error };
  }

  revalidatePath("/challenge");
};

const getQuestionsByTopic = async (topicId: string) => {
  try {
    return await prisma.challengeQuestion.findMany({
      where: {
        topicId: topicId,
      },
      include: {
        topic: true,
        chapter: true,
        options: true,
      },
      take: 5,
    });
  } catch (error) {
    throw error;
  }
};

export const getTopics = async (): Promise<Topic[]> => {
  try {
    return await prisma.topic.findMany();
  } catch (err) {
    throw err
  }
};
