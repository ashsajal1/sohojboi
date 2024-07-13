import React from 'react'
import Challange from './challange'
import prisma from '@/lib/prisma';
import { auth, clerkClient, User } from '@clerk/nextjs/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Select from './select';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Challenge Your Friends in Quizzes | Sohojboi",
  description: "Test your knowledge and challenge your friends in quizzes across various topics. Join the fun and see who comes out on top on Sohojboi.",
}

export default async function page({ searchParams }: { searchParams: any }) {
  const user = auth();
  const challengeeId = searchParams.challengeeId;
  const showQuiz = challengeeId;
  let questions;
  try {
    questions = await prisma.challengeQuestion.findMany({
      include: {
        tags: true,
        topic: true,
        chapter: true,
        options: true,
      },
      take: 3
    });
  } catch (error) {
    throw new Error("Error fetching questions:");
  }

  const competitions = await prisma.competition.findMany({
    where: {
      challengerId: {
        not: user.userId as string || ''
      },
      status: { equals: "pending" }
    }
  });

  let users: any = await (await clerkClient().users.getUserList()).data;
  users = JSON.parse(JSON.stringify(users))
  return (
    <div className='flex flex-col items-center gap-2'>

      {(!showQuiz) && <div className='mb-2'>
        <h1 className='p-4 text-center font-bold'>Select opponent</h1>
        <Select users={users} userId={user.userId as string} />
      </div>}
      {(!showQuiz) && competitions.map(c => (
        <Card key={c.id}>
          <CardHeader>
            <CardTitle>
              {c.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link href={`/challenge/accept?competitionId=${c.id}`}>
              <Button>Accept Challange</Button>
            </Link>
          </CardContent>
        </Card>
      ))}
      {showQuiz && <Challange quizId={questions![0].id} challengerId={user.userId as string} challengeeId={challengeeId} quizQuestions={questions!} />}
    </div>
  )
}
