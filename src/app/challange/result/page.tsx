import React from 'react';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function ResultPage({ searchParams }: { searchParams: any }) {
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
          questions: true
        }
      },
    }
  });

  if (!competition) {
    return <div>Competition not found.</div>;
  }

  const userIsChallenger = competition.challengerId === userId;
  const userScore = userIsChallenger ? competition.challengerScore : competition.challengeeScore;
  const opponentScore = userIsChallenger ? competition.challengeeScore : competition.challengerScore;

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            Competition Results: {competition.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Your Score:</strong> {userScore}</p>
          <p><strong>Opponent&apos;s Score:</strong> {opponentScore}</p>
          <p><strong>Status:</strong> {competition.status}</p>
        </CardContent>
      </Card>
      <div>
        <Link href="/challange">
          <Button>Back to Competitions</Button>
        </Link>
      </div>
    </div>
  );
}
