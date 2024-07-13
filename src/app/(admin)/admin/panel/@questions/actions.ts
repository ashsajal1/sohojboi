"use server"

import prisma from "@/lib/prisma"

export const deleteQuestion = async (id: string) => {
    await prisma.challengeQuestion.delete({
        where: {
            id: id
        }
    })
}