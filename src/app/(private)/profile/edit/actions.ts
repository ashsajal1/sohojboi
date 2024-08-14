"use server";

import prisma from "@/lib/prisma";
import { EditFormSchema } from "./edit-form";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const createOrUpdateProfile = async (data: EditFormSchema, currentUserId: string) => {
  try {
    if (data.name.length > 0) {
      await clerkClient().users.updateUser(currentUserId, {
        firstName: data.name.split(" ")[0],
        lastName: data.name.split(" ")[1] || "",
      });
    }

    const updatedProfile = await prisma.profile.upsert({
      where: {
        clerkUserId: currentUserId,
      },
      update: {
        bio: data.bio,
        grade: parseInt(data.grade),
        address: data.address,
      },
      create: {
        clerkUserId: currentUserId,
        bio: data.bio,
        grade: parseInt(data.grade),
        address: data.address,
      },
    });

    redirect("/profile");
  } catch (error) {
    throw error;
  }
};
