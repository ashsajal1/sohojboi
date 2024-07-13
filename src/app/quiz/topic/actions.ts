"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const createTopic = async (topicName: string) => {
  try {
    await prisma.topic.create({
      data: {
        name: topicName,
      },
    });
    revalidatePath('/')
  } catch (error) {
    throw new Error("Cannot create topic!");
  }
};
