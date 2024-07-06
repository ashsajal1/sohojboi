import React from 'react'
import Challange from './challange'
import prisma from '@/lib/prisma';
import { auth, clerkClient, User } from '@clerk/nextjs/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Select from './select';

export default async function page({ searchParams }: { searchParams: any }) {
  const user = auth();
  const challengeeId = searchParams.challengeeId;
  const showQuiz = challengeeId;
  const quizzes = await prisma.quiz.findMany({
    orderBy: {
      createdAt: 'desc'
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
  const competitions = await prisma.competition.findMany({
    where: {
      challengerId: {
        not: user.userId as string
      },
      status: { equals: "pending" }
    }
  });

  let users: any = await (await clerkClient().users.getUserList()).data;
  users = JSON.parse(JSON.stringify(users))
  return (
    <div>

      {(!showQuiz) && <div>
        <h1 className='p-4 text-center font-bold'>Select opponent</h1>
        <Select users={users} userId={user.userId as string} />
      </div>}
      {competitions.map(c => (
        <Card key={c.id}>
          <CardHeader>
            <CardTitle>
              {c.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link href={`/challange/accept?competitionId=${c.id}`}>
              <Button>Accept Challange</Button>
            </Link>
          </CardContent>
        </Card>
      ))}
      {showQuiz && <Challange quizId={quizzes[0].id} challangerId={user.userId as string} challangeeId={challengeeId} quizQuestions={quizQuestions} />}
    </div>
  )
}
