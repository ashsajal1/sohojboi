import React from 'react'
import Challange from './challange'
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server'

export default async function page({ searchParams }: { searchParams: any }) {
  const user = auth();
  console.log("Search : ", searchParams)
  const topic = searchParams.topic;
  const challangeeId = searchParams.challangeeId;
  const showQuiz = challangeeId && topic;
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
  return (
    <div>
      {showQuiz && <Challange quizId={quizzes[0].id} challangerId={user.userId as string} challangeeId={challangeeId} quizQuestions={quizQuestions} />}
    </div>
  )
}
