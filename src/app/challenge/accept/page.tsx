import React from 'react';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Challange from './challange-quiz';
import RedirectToResult from './redirect-to-result';

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
    if(competition?.status === 'completed') {
        return <RedirectToResult competitionId={competition.id} />
    }

    let questions;
    try {
        questions = await prisma.challengeQuestion.findMany({
            where: {
                id: {
                    in: questionIds
                }
            },
            include: {
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
    if (competition.challengeeScore === null || competition.challengerScore === null) {
        winnerId = null;
    } else if (competition.challengeeScore > competition.challengerScore) {
        winnerId = competition.challengeeId;
    } else if (competition.challengeeScore < competition.challengerScore) {
        winnerId = competition.challengerId;
    } else {
        winnerId = null;
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
                    <Challange winnerId={winnerId} challengerId={competition.challengerId} competitionId={competition.id} challengeeId={competition.challengeeId} quizQuestions={questions!} />
                </CardContent>
            </Card>
        </div>
    );
}
