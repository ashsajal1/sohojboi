import prisma from '@/lib/prisma'
import React from 'react'
import { DataTable } from './data-table';
import { columns } from './columns';

export default async function QuestionsSlot() {
  const questions = await prisma.challengeQuestion.findMany();
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={questions} />
    </div>
  )
}
