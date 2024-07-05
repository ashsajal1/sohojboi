"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// export const createAnswer = async (questionId: string, answerText: string) => {
//   const answer = await prisma.answer.create({
//     data: {
//       userId: "123",
//       questionId: questionId,
//       upvoteCount: 0,
//       answer: answerText,
//     },
//   });
// };

export const handleUpvote = async (id: string, currentUpvoteCount: number) => {
    "use server"
    const count = currentUpvoteCount + 1
    await prisma.answer.update({
        where: {
            id: id
        },
        data: {
            upvoteCount: count
        }
    })
    
    revalidatePath('')
}