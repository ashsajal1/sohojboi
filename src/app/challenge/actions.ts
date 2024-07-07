"use server";

import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { NotificationType } from "@prisma/client";

export const createCompetition = async (
  challangeeId: string,
  challangerId: string,
  quizId: string,
  challengerScore: number
  // challengerName: string,
) => {
  const challengerName = (await clerkClient().users.getUser(challangerId)).fullName;
  const challengeeName = (await clerkClient().users.getUser(challangeeId)).fullName;
  
  const competition = await prisma.competition.create({
    data: {
      title: `${challengerName} vs ${challengeeName}`,
      description: `A competition between ${challengerName} and ${challengeeName}`,
      quizId: quizId,
      challengerId: challangerId,
      challengeeId: challangeeId,
      challengerScore: challengerScore,
      status: "pending",
    },
  });
  // console.log(competition)

  
  const notif = await prisma.notification.create({
    data: {
      userId: challangeeId,
      message: `${challengerName} challenged you in a quiz!`,
      type: NotificationType.CHALLENGE,
      competitionId: competition.id
    },
  });

  // console.log(notif)
};
