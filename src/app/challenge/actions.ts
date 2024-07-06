"use server";

import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

export const createCompetition = async (
  challangeeId: string,
  challangerId: string,
  quizId: string,
  challengerScore: number
  // challengerName: string,
) => {
  const competition = await prisma.competition.create({
    data: {
      title: `${challangerId} vs ${challangeeId}`,
      description: `A competition`,
      quizId: quizId,
      challengerId: challangerId,
      challengeeId: challangeeId,
      challengerScore: challengerScore,
      status: "pending",
    },
  });
  // console.log(competition)

  const challengerName = (await clerkClient().users.getUser(challangerId)).fullName;
  const notif = await prisma.notification.create({
    data: {
      userId: challangeeId,
      message: `${challengerName} challenged you in a quiz!`,
    },
  });

  // console.log(notif)
};
