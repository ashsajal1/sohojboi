import React from 'react';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AcceptBtn from './accept-btn';
import WinnerConfetti from './winner-confetti';
import { CheckCircle2, XCircle, Trophy, Medal, Clock } from 'lucide-react';
import { Competition, ChallengeQuestion, AnswerOption } from '@prisma/client';
import { Progress } from '@/components/ui/progress';
import ResultContent from './result-content';
import { clerkClient } from '@clerk/nextjs/server';
import Image from 'next/image';

type QuestionWithOptions = ChallengeQuestion & {
  options: AnswerOption[];
};

async function UserComparison({ 
  challengerId, 
  challengeeId, 
  challengerScore, 
  challengeeScore, 
  winnerId 
}: { 
  challengerId: string;
  challengeeId: string;
  challengerScore: number;
  challengeeScore: number;
  winnerId: string;
}) {
  const challenger = await clerkClient().users.getUser(challengerId);
  const challengee = await clerkClient().users.getUser(challengeeId);

  return (
    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-lg mb-6">
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          <Image
            src={challenger.imageUrl}
            alt={challenger.fullName || ''}
            width={80}
            height={80}
            className="rounded-full border-4 border-white dark:border-gray-800"
          />
          {challengerId === winnerId && (
            <Trophy className="absolute -top-2 -right-2 w-8 h-8 text-yellow-500" />
          )}
        </div>
        <div className="text-center">
          <p className="font-bold">{challenger.fullName}</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{challengerScore}</p>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <p className="text-xl font-bold mb-2">VS</p>
        <div className="h-16 w-1 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          <Image
            src={challengee.imageUrl}
            alt={challengee.fullName || ''}
            width={80}
            height={80}
            className="rounded-full border-4 border-white dark:border-gray-800"
          />
          {challengeeId === winnerId && (
            <Trophy className="absolute -top-2 -right-2 w-8 h-8 text-yellow-500" />
          )}
        </div>
        <div className="text-center">
          <p className="font-bold">{challengee.fullName}</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{challengeeScore}</p>
        </div>
      </div>
    </div>
  );
}

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
      {competition.status === 'pending' ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-8 h-8" />
                <span>Waiting for Opponent</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-lg font-semibold">Your Performance</div>
                <div className="text-sm text-muted-foreground">Preliminary Results</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Your Score</span>
                  <span className="font-bold">{userScore}</span>
                </div>
                <Progress value={100} className="h-2" />
                
                <div className="flex justify-between">
                  <span>Opponent&apos;s Score</span>
                  <span className="text-muted-foreground">Waiting for participation</span>
                </div>
                <Progress value={0} className="h-2 bg-muted" />
              </div>
            </div>

            {/* Question Results */}
            <div className="space-y-4">
              <div className="text-lg font-semibold">Your Answers</div>
              <div className="grid grid-cols-5 gap-3">
                {questions.map((question, index) => {
                  const userAnswer = userAnswers.find(ans => ans.questionId === question.id);
                  const correctOption = question.options.find(opt => opt.isCorrect);
                  const isCorrect = userAnswer?.answer === correctOption?.content;
                  
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg flex items-center justify-center ${
                        isCorrect 
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                      }`}
                      title={`Question ${index + 1}: ${userAnswer?.answer || 'Not answered'} (Correct: ${correctOption?.content})`}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <XCircle className="w-6 h-6" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {userId === competition.challengeeId && (
              <div className="flex justify-center">
                <AcceptBtn competition={competition} />
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <UserComparison
            challengerId={competition.challengerId}
            challengeeId={competition.challengeeId}
            challengerScore={competition.challengerScore!}
            challengeeScore={competition.challengeeScore!}
            winnerId={winnerId}
          />
          <ResultContent 
            competition={competition}
            questions={questions}
            userAnswers={userAnswers}
            isWinner={isWinner}
            userScore={userScore}
            opponentScore={opponentScore}
            userId={userId}
          />
        </>
      )}

      <div className="grid place-items-center">
        <Link className="mt-2 w-full max-w-xs" href="/challenge">
          <Button variant="outline" className="w-full">Back to Competitions</Button>
        </Link>
      </div>
      
      {isWinner && competition.status !== 'pending' && (
        <div className="grid place-items-center">
          <WinnerConfetti />
        </div>
      )}
    </div>
  );
}
