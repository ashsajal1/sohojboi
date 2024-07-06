"use server";

import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

export const completeCompetition = async (
  competitionId: string,
  challengeeScore: number,
  challangerId: string,
  winnerId: string | null
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
  const challengerName = (await clerkClient().users.getUser(challangerId))
    .fullName;
  let notificationMessage;
  if (winnerId !== null && winnerId !== challangerId) {
    notificationMessage = `Congrats! You beat ${challengerName} in a challenge.`;
  } else if (winnerId === null) {
    notificationMessage = `Challenge completed against ${challengerName}! It's draw.`;
  } else {
    notificationMessage = `You lost a challenge against ${challengerName}.`;
  }
  await prisma.notification.create({
    data: {
      userId: challangerId,
      message: notificationMessage,
    },
  });
};
