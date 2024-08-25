"use server"

import prisma from "@/lib/prisma";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { NotificationType } from "@prisma/client";
import { revalidatePath } from "next/cache";
export const claimReferBonus = async (refererId: string) => {
    try {
        const user = await currentUser();
        const refererUser = await clerkClient().users.getUser(refererId)

        if (refererUser) {
            await prisma.profile.upsert({
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
                },
            });

            await prisma.refer.create({
                data: {
                    refereeId: user?.id!,
                    referrerId: refererId,
                    referredAt: new Date(),
                }
            })

            await prisma.notification.create({
                data: {
                    userId: refererId,
                    message: `${user?.fullName} claimed your refer bonus! You received 100 points.`,
                    type: NotificationType.QUESTION,
                }
            })
        } else {
            throw new Error("User not found");
        }

        revalidatePath("/");
    } catch (error) {
        throw error;
    }
};