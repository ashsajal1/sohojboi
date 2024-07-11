import React from 'react';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AcceptBtn from './accept-btn';
import Challange from './challange-quiz';

export default async function AcceptChallengePage({ searchParams }: { searchParams: any }) {
    const { competitionId } = searchParams;

    if (!competitionId) {
        return <div>No competition selected.</div>;
    }

    const competition = await prisma.competition.findUnique({
        where: {
            id: competitionId
        },
    });

    const questionIds = competition?.questionIds;

    let questions;
    try {
        questions = await prisma.challengeQuestion.findMany({
            where: {
                id: {
                    in: questionIds
                }
            },
            include: {
                tags: true,
                topic: true,
                chapter: true,
                options: true,
            },
        });
    } catch (error) {
        throw new Error("Error fetching questions.");
    }

    if (!competition) {
        return <div>Competition not found.</div>;
    }

    let winnerId;
    const isDraw = competition.challengeeScore || 0 === competition.challengerScore;
    const isChallengeeWinner = competition.challengeeScore || 0 > competition.challengerScore;
    if (isDraw) {
        winnerId = null
    } else if (isChallengeeWinner) {
        winnerId = competition.challengeeId
    } else {
        winnerId = competition.challengerId
    }

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Accept Challenge: {competition.title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Challange winnerId={winnerId} challengerId={competition.challengerId} competitionId={competition.id} quizQuestions={questions!} />
                    <AcceptBtn competitionId={competitionId} />
                </CardContent>
            </Card>
        </div>
    );
}
