"use server"

import prisma from "@/lib/prisma";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { NotificationType } from "@prisma/client";
import { revalidatePath } from "next/cache";
export const claimReferBonus = async (refererId: string) => {
    try {
        const user = await currentUser();
        const refererUser = await clerkClient().users.getUser(refererId);

        if(user?.id === refererId) {
            return { error : "You cannot refer yourself!" };
        }

        if (refererUser) {
            await Promise.all([
                prisma.profile.upsert({
                    where: {
                        clerkUserId: refererId,
                    },
                    create: {
                        clerkUserId: refererId,
                        rewardCount: 100,
                        bio: "default",
                    },
                    update: {
                        rewardCount: {
                            increment: 100,
                        },
                        referralCount: {
                            increment: 1
                        }
                    },
                }),
                prisma.profile.upsert({
                    where: {
                        clerkUserId: user?.id!,
                    },
                    create: {
                        clerkUserId: refererId,
                        rewardCount: 100,
                        bio: "default",
                    },
                    update: {
                        rewardCount: {
                            increment: 100,
                        },
                    },
                }),
                prisma.notification.create({
                    data: {
                        userId: user?.id!,
                        message: `🎉Congrats! You received 100 points for using refer code.`,
                        type: NotificationType.QUESTION,
                    }
                }),
                prisma.refer.create({
                    data: {
                        refereeId: user?.id!,
                        referrerId: refererId,
                        referredAt: new Date(),
                    }
                }),
                prisma.notification.create({
                    data: {
                        userId: refererId,
                        message: `${user?.fullName} claimed your refer bonus! You received 100 points.`,
                        type: NotificationType.QUESTION,
                    }
                }),
            ]);

        } else {
            throw new Error("User not found");
        }

        revalidatePath("/");
    } catch (error) {
        throw error;
    }
};