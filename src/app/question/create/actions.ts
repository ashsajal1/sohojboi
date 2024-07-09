"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const createQuestion = async (previousState: any, formData: FormData) => {
  const user = await currentUser();
  const title = formData.get("title");
  const description = formData.get("description");
  let newQuestion;

  try {
    newQuestion = await prisma.question.create({
      data: {
        userId: user?.id as string,
        questionTitle: title as string,
        questionDescription: description as string,
        userFirstName: user?.firstName as string,
        userLastName: user?.lastName as string,
        userFullName: user?.fullName as string,
      },
    });

  } catch (error) {
    return "An unexpected error occurred. Try again."
  }

  redirect(`/question/${newQuestion.id}`);
};
