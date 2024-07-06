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

//   console.log(notfi)

  revalidatePath("/notifications");
};
