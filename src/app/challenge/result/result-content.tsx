'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Medal } from 'lucide-react';
import { motion } from 'framer-motion';
import { Competition, ChallengeQuestion, AnswerOption } from '@prisma/client';
import AcceptBtn from './accept-btn';

type ResultContentProps = {
  competition: Competition;
  questions: (ChallengeQuestion & { options: AnswerOption[] })[];
  userAnswers: any[];
  isWinner: boolean;
  userScore: number | null;
  opponentScore: number | null;
  userId: string | null;
};

export default function ResultContent({
  competition,
  questions,
  userAnswers,
  isWinner,
  userScore,
  opponentScore,
  userId
}: ResultContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {isWinner ? (
              <div className="flex items-center justify-center gap-2 text-yellow-500">
                <Trophy className="w-8 h-8" />
                <span>You Won!</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Medal className="w-8 h-8" />
                <span>Competition Results</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Comparison */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold">Score Comparison</div>
              <div className="text-sm text-muted-foreground">
                {competition.status === 'completed' ? 'Final Results' : 'Current Score'}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Your Score</span>
                <span className="font-bold">{userScore}</span>
              </div>
              <Progress value={(userScore! / (userScore! + opponentScore!)) * 100} className="h-2" />
              
              <div className="flex justify-between">
                <span>Opponent&apos;s Score</span>
                <span className="font-bold">{opponentScore}</span>
              </div>
              <Progress value={(opponentScore! / (userScore! + opponentScore!)) * 100} className="h-2" />
            </div>
          </div>

          {userId === competition.challengeeId && competition.status === 'pending' && (
            <div className="flex justify-center">
              <AcceptBtn competition={competition} />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
} 