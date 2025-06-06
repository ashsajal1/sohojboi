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

    return competition;
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
export const completeCompetition = async (
  competitionId: string,
  challengeeScore: number,
  challangerId: string,
  winnerId: string | null,
  challengeeId: string
) => {
  const competition = await prisma.competition.update({
    where: {
      id: competitionId,
    },
    data: {
      challengeeScore: challengeeScore,
      status: "completed",
    },
  });

  const challengeeName = await (
    await clerkClient().users.getUser(challengeeId)
  ).fullName;

  let notificationMessage;
  if (winnerId === challangerId) {
    notificationMessage = `Congrats! You beat ${challengeeName} in a challenge.`;
  } else if (winnerId === null) {
    notificationMessage = `Challenge completed against ${challengeeName}! It's draw.`;
  } else if (winnerId === challengeeId) {
    notificationMessage = `You lost a challenge against ${challengeeName}.`;
  }

  const result = await prisma.notification.create({
    data: {
      userId: challangerId,
      message: notificationMessage!,
      type: NotificationType.CHALLENGE,
      competitionId: competition.id,
    },
  });

  return competition;

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

export const getChallengeData = async (challangeeId: string) => {
  try {
     let challengee = await clerkClient().users.getUser(challangeeId);
     challengee = JSON.parse(JSON.stringify(challengee))
     return challengee;
  } catch (err) {
    throw err;
  }
};