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

  const winnerId = competition.challengeeScore! > competition.challengerScore! ? competition.challengeeId : competition.challengerId;
  const isWinner = userId === winnerId;
  const userIsChallenger = competition.challengerId === userId;
  const userScore = userIsChallenger ? competition.challengerScore : competition.challengeeScore;
  const opponentScore = userIsChallenger ? competition.challengeeScore : competition.challengerScore;

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

          <div className="mt-6">
            <h3 className="text-xl font-bold mb-4">Questions</h3>
            <div className="space-y-4">
              {questions.map((question) => {
                const correctOption = question.options.find(opt => opt.isCorrect);
                return (
                  <div 
                    key={question.id} 
                    className="p-4 rounded-lg border dark:border-gray-700 dark:bg-gray-800/50"
                  >
                    <div className="space-y-2">
                      <p className="font-medium">{question.content}</p>
                      <div className="space-y-1">
                        {question.options.map((option) => (
                          <div 
                            key={option.id}
                            className={`p-2 rounded ${
                              option.isCorrect 
                                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                                : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {option.isCorrect ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-gray-400" />
                              )}
                              <span>{option.content}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {question.explanation && (
                        <p className="text-sm text-muted-foreground mt-2">
                          <strong>Explanation:</strong> {question.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
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
