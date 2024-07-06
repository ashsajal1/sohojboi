"use server";

import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

export const completeCompetition = async (
  competitionId: string,
  challengeeScore: number,
  challangerId: string
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
  // console.log(competition);
  const challengerName = (await clerkClient().users.getUser(challangerId)).fullName;
  await prisma.notification.create({
    data: {
      userId: challangerId,
      message: `${challengerName} accepted challenge!`,
    }
  })
};
