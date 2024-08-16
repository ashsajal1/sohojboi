import React from 'react'
import Challange from './challange'
import prisma from '@/lib/prisma';
import { auth, clerkClient, User } from '@clerk/nextjs/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Select from './select';
import { Metadata } from "next";
import DeclineBtn from './decline-btn';
import AcceptBtn from './accept-btn';

/**
 * Component for the Challenge page.
 * This page displays a list of pending challenges and allows the user to select an opponent.
 * If an opponent is selected, the page displays the Challenge Quiz component.
 */
export const metadata: Metadata = {
  title: "Challenge Your Friends in Quizzes | Sohojboi",
  description: "Test your knowledge and challenge your friends in quizzes across various topics. Join the fun and see who comes out on top on Sohojboi.",
  keywords: ["challenge, quiz, knowledge, friends, competition, topics, education, fun"]
}

/**
 * Challenge page component.
 * This component displays a list of pending challenges and allows the user to select an opponent.
 * If an opponent is selected, the page displays the Challenge Quiz component.
 * @returns {JSX.Element} The Challenge page component.
 */
export default async function page({ searchParams }: { searchParams: any }) {
  // Get the authenticated user
  const user = auth();
  // Get the selected challengee ID from the URL parameters
  const challengeeId = searchParams.challengeeId;
  // Determine if the Challenge Quiz component should be displayed
  const showQuiz = challengeeId;
  // Retrieve a list of challenge questions for the Challenge Quiz component
  let questions;
  try {
    questions = await prisma.challengeQuestion.findMany({
      include: {
        topic: true,
        chapter: true,
        options: true,
      },
      take: 3
    });
  } catch (error) {
    throw new Error("Error fetching questions:");
  }

  // Retrieve a list of pending challenges for the authenticated user
  const competitions = await prisma.competition.findMany({
    where: {
      challengerId: {
        not: user.userId as string || ''
      },
      challengeeId: user.userId!,
      status: { equals: "pending" }
    }
  });

  // Retrieve a list of all users
  let users: any = await (await clerkClient().users.getUserList()).data;
  // Deep copy the users list to prevent mutation
  users = JSON.parse(JSON.stringify(users))

  return (
    <div className='flex flex-col items-center gap-2'>

      {/* Display the Select component if no opponent is selected */}
      {(!showQuiz) && <div className='mb-2 w-full'>
        <h1 className='p-4 text-center font-bold'>Select opponent</h1>
        <Select users={users} userId={user.userId as string} />
      </div>}

      {/* Display a list of pending challenges */}
      <div className='grid grid-cols-1 w-full md:grid-cols-3 gap-2'>
        {(!showQuiz) && competitions.map(c => (
          <Card className='w-full' key={c.id}>
            <CardHeader>
              <CardTitle>
                {c.title}
              </CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-2'>
              <AcceptBtn competition={c} />
              <DeclineBtn competiton={c} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Display the Challenge Quiz component if an opponent is selected */}
      {showQuiz && <Challange quizId={questions![0].id} challengerId={user.userId as string} challengeeId={challengeeId} quizQuestions={questions!} />}
    </div>
  )
}

