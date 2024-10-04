"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const createSeries = async (title: string, userId: string) => {
  await prisma.blogSeries.create({
    data: {
      title,
      userId,
      deletedAt: null,
    },
  });

  revalidatePath("/series");
};
