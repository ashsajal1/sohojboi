import React from 'react';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AcceptBtn from './accept-btn';
import Challange from './challange-quiz';

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

    const quizzes = await prisma.quiz.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        where: {
            id: competition?.quizId
        },
        include: {
          questions: {
            include: {
              options: true
            }
          },
        }
      })
    
      const quizQuestions = quizzes.map((quiz) => ({
        id: quiz.id,
        title: quiz.title,
        questions: quiz.questions.map((question) => ({
          id: question.id,
          text: question.content,
          options: question.options.map((option) => ({
            id: option.id,
            text: option.content,
            isCorrect: option.isCorrect
          }))
        }))
      })).map(quesitons => quesitons.questions)[0];

    // const quizQuestions = quizzes.map((quiz) => ({
    //     id: quiz.id,
    //     title: quiz.title,
    //     questions: quiz.questions.map((question) => ({
    //       id: question.id,
    //       text: question.content,
    //       options: question.options.map((option) => ({
    //         id: option.id,
    //         text: option.content,
    //         isCorrect: option.isCorrect
    //       }))
    //     }))
    //   })).map(quesitons => quesitons.questions)[0];

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
                    <Challange competitionId={competition.id} quizQuestions={quizQuestions} />
                    <AcceptBtn competitionId={competitionId} />
                </CardContent>
            </Card>
        </div>
    );
}
