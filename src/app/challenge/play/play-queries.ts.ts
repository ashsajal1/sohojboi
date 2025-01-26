import prisma from "@/lib/prisma";
import { ChallengeQuestion, Competition, Prisma } from "@prisma/client";

// Define ChallengeQuestion type with included relations
type ChallengeQuestionWithRelations = Prisma.ChallengeQuestionGetPayload<{
  include: {
    topic: true;
    chapter: true;
    options: true;
  };
}>;


export async function getCompetitionDetails(
  competitionId: string
): Promise<Competition | null> {
  return await prisma.competition.findUnique({ where: { id: competitionId } });
}

export async function fetchQuestionsByTopic(
  topicId: string
): Promise<ChallengeQuestionWithRelations[]> {
  return await prisma.challengeQuestion.findMany({
    where: { topicId },
    include: { topic: true, chapter: true, options: true },
    take: 3,
  });
}

export async function fetchQuestionsByIds(
  questionIds: string[]
): Promise<ChallengeQuestionWithRelations[]> {
  return await prisma.challengeQuestion.findMany({
    where: { id: { in: questionIds } },
    include: { topic: true, chapter: true, options: true },
  });
}