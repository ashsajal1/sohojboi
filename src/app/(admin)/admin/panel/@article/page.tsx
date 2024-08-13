import prisma from '@/lib/prisma'
import React from 'react'
import { DataTable } from './data-table';
import { columns } from './columns';

export default async function QuestionsSlot() {
  const article = await prisma.article.findMany();
  return (
    <div className="container mx-auto py-10">
        <h1 className='font-bold text-lg'>Article List</h1>
      <DataTable columns={columns} data={article} />
    </div>
  )
}
