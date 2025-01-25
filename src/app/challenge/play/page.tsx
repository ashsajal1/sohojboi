import React from 'react'
import prisma from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server'
import { Metadata } from "next";
import Challange from '../challange';

export const metadata: Metadata = {
  title: "Challenge Your Friends in Quizzes | Sohojboi",
  description: "Test your knowledge and challenge your friends in quizzes across various topics. Join the fun and see who comes out on top on Sohojboi.",
  keywords: ["challenge, quiz, knowledge, friends, competition, topics, education, fun"]
}

export default async function page({ searchParams }: { searchParams: any }) {
  let user = await currentUser();
  user = JSON.parse(JSON.stringify(user))
  const challengeeId = searchParams.challengeeId;
  const topicId = searchParams.topicId;

  if (challengeeId === user?.id) {
    throw new Error("You cannot challenge yourself!")
  }

  // Retrieve a list of challenge questions for the Challenge Quiz component

  let questions;
  try {
    questions = await prisma.challengeQuestion.findMany({
      where: {
        topicId: topicId
      },
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

  if(questions.length === 0) {
    return <div className='text-center p-2 font-bold'>There are no questions for this topic</div>
  }

  return (
    <div className='flex flex-col items-center gap-2'>

      {/* Display the Challenge Quiz component if an opponent is selected */}
      <Challange topic={questions![0].topic?.name!} quizId={questions![0].id} challenger={user!} challengeeId={challengeeId} quizQuestions={questions!} />
    </div>
  )
}

