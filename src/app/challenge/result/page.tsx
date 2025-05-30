import React from 'react';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AcceptBtn from './accept-btn';
import WinnerConfetti from './winner-confetti';
import { CheckCircle2, XCircle, Trophy, Medal } from 'lucide-react';
import { Competition, ChallengeQuestion, AnswerOption } from '@prisma/client';
import { Progress } from '@/components/ui/progress';
import ResultContent from './result-content';

type QuestionWithOptions = ChallengeQuestion & {
  options: AnswerOption[];
};

export default async function ResultPage({ searchParams }: { searchParams: any }) {
  const { userId } = await auth();
  const { competitionId } = searchParams;

  if (!competitionId) {
    return <div>No competition selected.</div>;
  }

  const competition = await prisma.competition.findUnique({
    where: {
      id: competitionId
    }
  });

  if (!competition) {
    return <div>Competition not found.</div>;
  }

  const questions = await prisma.challengeQuestion.findMany({
    where: {
      id: {
        in: competition.questionIds
      }
    },
    include: {
      options: true
    }
  });

  // Get user's selected answers from the database
  const userAnswers = userId ? await prisma.answer.findMany({
    where: {
      userId: userId,
      questionId: {
        in: competition.questionIds
      }
    }
  }) : [];

  const winnerId = competition.challengeeScore! > competition.challengerScore! ? competition.challengeeId : competition.challengerId;
  const isWinner = userId === winnerId;
  const userIsChallenger = competition.challengerId === userId;
  const userScore = userIsChallenger ? competition.challengerScore : competition.challengeeScore;
  const opponentScore = userIsChallenger ? competition.challengeeScore : competition.challengerScore;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <ResultContent 
        competition={competition}
        questions={questions}
        userAnswers={userAnswers}
        isWinner={isWinner}
        userScore={userScore}
        opponentScore={opponentScore}
        userId={userId}
      />

      <div className="grid place-items-center">
        <Link className="mt-2 w-full max-w-xs" href="/challenge">
          <Button variant="outline" className="w-full">Back to Competitions</Button>
        </Link>
      </div>
      
      {isWinner && (
        <div className="grid place-items-center">
          <WinnerConfetti />
        </div>
      )}
    </div>
  );
}
