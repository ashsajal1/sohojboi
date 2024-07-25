"use server";

import prisma from "@/lib/prisma";
import { EditFormSchema } from "./edit-form";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const createOrUpdateProfile = async (data: EditFormSchema) => {
  try {
    const user = await currentUser();
    const updatedProfile = await prisma.profile.upsert({
      where: {
        clerkUserId: user?.id,
      },
      update: {
        bio: data.bio,
      },
      create: {
        clerkUserId: user?.id,
        bio: data.bio,
        grade: parseInt(data.grade),
        address: data.address,
      },
    });

    console.log(updatedProfile);
    redirect("/profile");
  } catch (error) {
    throw error;
  }
};
