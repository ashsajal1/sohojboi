import { ChallengeQuestionStatus, Question, Topic } from "@prisma/client";
import prisma from "./prisma";

export async function getUserWinLoseStats(userId: string) {
  const result = await prisma.competition.aggregateRaw({
    pipeline: [
      {
        $match: {
          status: "completed",
          $or: [{ challengerId: userId }, { challengeeId: userId }],
        },
      },
      {
        $project: {
          userId: {
            $cond: [
              { $eq: ["$challengerId", userId] },
              "$challengerId",
              "$challengeeId",
            ],
          },
          opponentId: {
            $cond: [
              { $eq: ["$challengerId", userId] },
              "$challengeeId",
              "$challengerId",
            ],
          },
          userScore: {
            $cond: [
              { $eq: ["$challengerId", userId] },
              "$challengerScore",
              "$challengeeScore",
            ],
          },
          opponentScore: {
            $cond: [
              { $eq: ["$challengerId", userId] },
              "$challengeeScore",
              "$challengerScore",
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          wins: {
            $sum: {
              $cond: [{ $gt: ["$userScore", "$opponentScore"] }, 1, 0],
            },
          },
          losses: {
            $sum: {
              $cond: [{ $lt: ["$userScore", "$opponentScore"] }, 1, 0],
            },
          },
        },
      },
    ],
  });

  // Type assertion to ensure the result is an array of JsonObject
  const aggregatedResult = result as unknown as Array<{
    wins: number;
    losses: number;
  }>;

  // Check if the result is not empty and return the stats
  if (aggregatedResult.length > 0) {
    return aggregatedResult[0];
  } else {
    return { wins: 0, losses: 0 };
  }
}

type TopicWithQuestions = {
    totalQuestions: number;
    pendingQuestions: number;
    publishedQuestions: number;
    archivedQuestions: number;
    topicWithMostQuestions: {
        id: string;
        name: string;
        questionsCount: number;
    } | null;
}

export async function getChallengeQuestionsSummarizeData(): Promise<TopicWithQuestions> {
  try {
    // Aggregate functions
    const totalQuestions = await prisma.challengeQuestion.count();
    const pendingQuestions = await prisma.challengeQuestion.count({
      where: { status: ChallengeQuestionStatus.PENDING },
    });
    const publishedQuestions = await prisma.challengeQuestion.count({
      where: { status: ChallengeQuestionStatus.PUBLISHED },
    });
    const archivedQuestions = await prisma.challengeQuestion.count({
      where: { status: ChallengeQuestionStatus.ARCHIVED },
    });

    // Querying related data
    const topicWithMostQuestions =
      await prisma.topic.findFirst({
        include: {
            questions: true
        },
        orderBy: {
          questions: {
            _count: "desc",
          },
        },
      });

      const summary  = {
        totalQuestions,
        pendingQuestions,
        publishedQuestions,
        archivedQuestions,
        topicWithMostQuestions: topicWithMostQuestions ? {
          id: topicWithMostQuestions.id,
          name: topicWithMostQuestions.name,
          questionsCount: topicWithMostQuestions.questions?.length || 0, // Use optional chaining and default to 0
        } : null,
      };

    return summary;
  } catch (error) {
    console.error("Error summarizing data:", error);
    throw error;
  }
}
