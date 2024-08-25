"ues server"

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const claimReferBonus = async (refererId: string) => {
    try {
        const user = await currentUser();
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

        revalidatePath("/");
    } catch (error) {
        throw error;
    }
};