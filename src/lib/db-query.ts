import prisma from "./prisma";

export async function getUserWinLoseStats(userId: string) {
    const result = await prisma.competition.aggregateRaw({
        pipeline: [
            {
                $match: {
                    status: 'completed',
                    $or: [
                        { challengerId: userId },
                        { challengeeId: userId }
                    ]
                }
            },
            {
                $project: {
                    userId: {
                        $cond: [
                            { $eq: ['$challengerId', userId] }, 
                            '$challengerId', 
                            '$challengeeId'
                        ],
                    },
                    opponentId: {
                        $cond: [
                            { $eq: ['$challengerId', userId] }, 
                            '$challengeeId', 
                            '$challengerId'
                        ],
                    },
                    userScore: {
                        $cond: [
                            { $eq: ['$challengerId', userId] }, 
                            '$challengerScore', 
                            '$challengeeScore'
                        ],
                    },
                    opponentScore: {
                        $cond: [
                            { $eq: ['$challengerId', userId] }, 
                            '$challengeeScore', 
                            '$challengerScore'
                        ],
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    wins: {
                        $sum: {
                            $cond: [
                                { $gt: ['$userScore', '$opponentScore'] },
                                1,
                                0
                            ]
                        }
                    },
                    losses: {
                        $sum: {
                            $cond: [
                                { $lt: ['$userScore', '$opponentScore'] },
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]
    });

    // Type assertion to ensure the result is an array of JsonObject
    const aggregatedResult = result as unknown as Array<{ wins: number, losses: number }>;

    // Check if the result is not empty and return the stats
    if (aggregatedResult.length > 0) {
        return aggregatedResult[0];
    } else {
        return { wins: 0, losses: 0 };
    }
}