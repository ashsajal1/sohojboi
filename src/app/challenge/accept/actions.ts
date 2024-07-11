"use server";

import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { NotificationType } from "@prisma/client";

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

  const challengerName = await (await clerkClient().users.getUser(challangerId)).fullName;

  const winnerName = await (await clerkClient().users.getUser(winnerId!)).fullName;

  let notificationMessage;
  if (winnerId !== null && winnerId !== challangerId) {
    notificationMessage = `Congrats! You beat ${challengerName} in a challenge.`;
  } else if (winnerId === null) {
    notificationMessage = `Challenge completed against ${challengerName}! It's draw.`;
  } else {
    notificationMessage = `You lost a challenge against ${winnerName}.`;
  }

  await prisma.notification.create({
    data: {
      userId: challangerId,
      message: notificationMessage,
      type: NotificationType.CHALLENGE,
      competitionId: competition.id,
    },
  });
};
