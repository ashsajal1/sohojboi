import React from 'react';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AcceptBtn from './accept-btn';
import WinnerConfetti from './winner-confetti';

export default async function ResultPage({ searchParams }: { searchParams: any }) {
  const { userId } = await auth();
  const { competitionId } = searchParams;

  if (!competitionId) {
    return <div>No competition selected.</div>;
  }

  const competition = await prisma.competition.findUnique({
    where: {
      id: competitionId
    },
  });

  const winnerId = competition?.challengeeScore! > competition?.challengerScore! ? competition?.challengeeId : competition?.challengerId

  const isWinner = userId === winnerId;

  if (!competition) {
    return <div>Competition not found.</div>;
  }

  const userIsChallenger = competition.challengerId === userId;
  const userScore = userIsChallenger ? competition.challengerScore : competition.challengeeScore;
  const opponentScore = userIsChallenger ? competition.challengeeScore : competition.challengerScore;

  return (
    <div>
      {isWinner && <div className='grid place-items-center'>
        <WinnerConfetti />
        </div>}
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
          {userId === competition.challengeeId && <div className='mt-2'>
            {competition.status === 'pending' && <AcceptBtn competition={competition} />}
          </div>}
        </CardContent>
      </Card>
      <div className='grid place-items-center'>
        <Link className='mt-2 w-full' href="/challenge">
          <Button variant={'link'} className='w-full'>Back to Competitions</Button>
        </Link>
      </div>
    </div>
  );
}
