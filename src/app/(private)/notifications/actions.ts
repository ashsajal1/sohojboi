"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const handleMarkRead = async (notificationId: string) => {
  const notfi = await prisma.notification.update({
    where: {
      id: notificationId,
    },
    data: {
      read: true,
    },
  });

  revalidatePath("/notifications");
};

export const readAllNotificaiton = async (userId: string) => {
  await prisma.notification.updateMany({
    where: {
      userId: userId,
      read: false,
    },
    data: {
      read: true,
    },
  });

  revalidatePath("/notifications");
};
