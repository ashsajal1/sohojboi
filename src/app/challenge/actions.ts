"use server"

import prisma from "@/lib/prisma";

export const createCompetition = async (challangeeId: string, challangerId: string, quizId:string, challengerScore: number ) => {
    const competition = await prisma.competition.create({
        data: {
          title: `${challangerId} vs ${challangeeId}`,
          description: `A competition`,
          quizId: quizId,
          challengerId: challangerId,
          challengeeId: challangeeId,
          challengerScore: challengerScore,
          status: 'pending'
        }
      });
      console.log(competition)
}