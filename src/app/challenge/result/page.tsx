import React from 'react';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AcceptBtn from './accept-btn';
import WinnerConfetti from './winner-confetti';
import { CheckCircle2, XCircle, Circle } from 'lucide-react';
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
                const userAnswer = userAnswers.find(ans => ans.questionId === question.id);
                return (
                  <div 
                    key={question.id} 
                    className="p-4 rounded-lg border dark:border-gray-700 dark:bg-gray-800/50"
                  >
                    <div className="space-y-2">
                      <p className="font-medium">{question.content}</p>
                      <div className="space-y-1">
                        {question.options.map((option) => {
                          const isUserSelected = userAnswer?.answer === option.content;
                          return (
                            <div 
                              key={option.id}
                              className={`p-2 rounded ${
                                isUserSelected
                                  ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                                  : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {isUserSelected ? (
                                  <Circle className="w-4 h-4 text-blue-500" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-gray-400" />
                                )}
                                <span>{option.content}</span>
                                {isUserSelected && !option.isCorrect && (
                                  <span className="text-sm text-red-500 ml-2">(Your answer)</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
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
