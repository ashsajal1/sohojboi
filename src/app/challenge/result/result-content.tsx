'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Trophy, Medal } from 'lucide-react';
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

          {/* Question Results */}
          <div className="space-y-4">
            <div className="text-lg font-semibold">Question Results</div>
            <div className="grid grid-cols-5 gap-3">
              {questions.map((question, index) => {
                const userAnswer = userAnswers.find(ans => ans.questionId === question.id);
                const correctOption = question.options.find(opt => opt.isCorrect);
                const isCorrect = userAnswer?.answer === correctOption?.content;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
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
                  </motion.div>
                );
              })}
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