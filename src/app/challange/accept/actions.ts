"use server";

import prisma from "@/lib/prisma";

export const completeCompetition = async (
  competitionId: string,
  challengeeScore: number
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
  console.log(competition);
};
