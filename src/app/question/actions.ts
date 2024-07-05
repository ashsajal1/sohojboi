"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export const handleQuestionUpvote = async (id: string, currentUpvoteCount: number) => {
    "use server"
    const count = currentUpvoteCount + 1
    await prisma.question.update({
        where: {
            id: id
        },
        data: {
            upvoteCount: count
        }
    })
    
    revalidatePath('')
}