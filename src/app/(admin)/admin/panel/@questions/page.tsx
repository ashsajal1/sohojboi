import prisma from '@/lib/prisma'
import React from 'react'

export default async function QuestionsSlot() {
  const questions = await prisma.challengeQuestion.findMany();
  return (
    <div>QuestionSlot</div>
  )
}
