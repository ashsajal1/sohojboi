import React from 'react';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AcceptBtn from './accept-btn';
import WinnerConfetti from './winner-confetti';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Competition, ChallengeQuestion, AnswerOption } from '@prisma/client';

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

  // Calculate question results
  const questionResults = questions.map(question => {
    const userAnswer = userAnswers.find(ans => ans.questionId === question.id);
    const correctOption = question.options.find(opt => opt.isCorrect);
    return userAnswer?.answer === correctOption?.content;
  });

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Competition Results: {competition.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-lg font-semibold">Your Score: {userScore}</p>
              <p className="text-lg font-semibold">Opponent&apos;s Score: {opponentScore}</p>
              <p className="text-lg font-semibold">Status: {competition.status}</p>
            </div>
            {userId === competition.challengeeId && (
              <div className='mt-2'>
                {competition.status === 'pending' && <AcceptBtn competition={competition} />}
              </div>
            )}
          </div>

          {/* Question Status Icons */}
          <div className="flex flex-wrap gap-2 mt-4">
            {questionResults.map((isCorrect, index) => (
              <div
                key={index}
                className={`p-2 rounded-full ${
                  isCorrect 
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                }`}
              >
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className='grid place-items-center'>
        <Link className='mt-2 w-full' href="/challenge">
          <Button variant={'link'} className='w-full'>Back to Competitions</Button>
        </Link>
      </div>
      
      {isWinner && (
        <div className='grid place-items-center'>
          <WinnerConfetti />
        </div>
      )}
    </div>
  );
}
