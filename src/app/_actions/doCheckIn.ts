"use server";
import prisma from "@/lib/prisma";

const doCheckIn = async (userId: string): Promise<boolean> => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0); // Set the date to 12:00 AM UTC for today

  // Check if there's already a check-in for today
  const existingCheckIn = await prisma.checkIn.findFirst({
    where: {
      userId,
      createdAt: {
        gte: today, // Only find check-ins created today
      },
    },
  });

  // If a check-in exists for today, skip adding another bonus
  if (existingCheckIn) {
    return false; // No bonus added since user already checked in today
  }

  const dailyBonusAmount = 1000;
  // Perform both operations concurrently
  await Promise.all([
    prisma.checkIn.create({
      data: {
        userId,
        bonus: dailyBonusAmount,
      },
    }),
    await prisma.profile.upsert({
      where: {
        clerkUserId: userId,
      },
      update: {
        rewardCount: {
          increment: dailyBonusAmount,
        },
      },
      create: {
        clerkUserId: userId,
        rewardCount: dailyBonusAmount, // Set the initial reward count
      },
    })
  ]);

  return true; // Bonus added
};

export default doCheckIn;
