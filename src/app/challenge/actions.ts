"use server";

import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { NotificationType } from "@prisma/client";

export const createCompetition = async (
  challangeeId: string,
  challangerId: string,
  questionIds: string[],
  challengerScore: number
  // challengerName: string,
) => {
  console.log("Users ids : ", challangeeId, challangerId)
  try {
    const challengerName = (await clerkClient().users.getUser(challangerId))
      .fullName as string;
    const challengeeName = (await clerkClient().users.getUser(challangeeId))
      .fullName as string;

    const competition = await prisma.competition.create({
      data: {
        title: `${challengerName} vs ${challengeeName}`,
        description: `A competition between ${challengerName} and ${challengeeName}`,
        questionIds: questionIds,
        challengerId: challangerId,
        challengeeId: challangeeId,
        challengerScore: challengerScore,
        status: "pending",
      },
    });
    console.log(competition);

    const notif = await prisma.notification.create({
      data: {
        userId: challangeeId,
        message: `${challengerName} challenged you in a quiz!`,
        type: NotificationType.CHALLENGE,
        competitionId: competition.id,
      },
    });
  } catch (error) {
    console.error("Error creating competition:", error);
    throw error
  }

  // console.log(notif)
};
