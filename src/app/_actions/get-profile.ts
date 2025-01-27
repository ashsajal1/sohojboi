"use server"

import prisma from "@/lib/prisma";
import { clerkClient, User } from "@clerk/nextjs/server";
import { Profile } from "@prisma/client";

export async function getProfile(userId: string): Promise<[User, Profile | null]> {
    let user = await (await clerkClient()).users.getUser(userId);
    user = JSON.parse(JSON.stringify(user))
    const profile = await prisma.profile.findUnique({
        where: {
            clerkUserId: user.id,
        },
    });

    return [user, profile]; // Return as a tuple [User, Profile]
}