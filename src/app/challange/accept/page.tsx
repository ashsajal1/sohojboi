import React from 'react';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AcceptBtn from './accept-btn';

export default async function AcceptChallengePage({ searchParams }: { searchParams: any }) {
    const { userId } = auth();
    const { competitionId } = searchParams;

    if (!competitionId) {
        return <div>No competition selected.</div>;
    }

    const competition = await prisma.competition.findUnique({
        where: {
            id: competitionId
        },
        include: {
            quiz: {
                include: {
                    questions: {
                        include: {
                            options: true
                        }
                    }
                }
            }
        }
    });

    if (!competition) {
        return <div>Competition not found.</div>;
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
                    <AcceptBtn competitionId={competitionId} />
                </CardContent>
            </Card>
        </div>
    );
}
