import React from 'react'
import Challange from './challange'
import prisma from '@/lib/prisma';

export default async function page() {
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
      <Challange quizQuestions={quizQuestions} />
    </div>
  )
}
