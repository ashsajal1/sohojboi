"use server";

import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { NotificationType } from "@prisma/client";
import { redirect } from "next/navigation";

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

  if (competition.status === "completed") {
    redirect(`/challenge/result?competitionId=${competitionId}`);
  }

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

  await prisma.notification.create({
    data: {
      userId: challangerId,
      message: notificationMessage!,
      type: NotificationType.CHALLENGE,
      competitionId: competition.id,
    },
  });
};
