import prisma from '@/lib/prisma'
import React from 'react'
import { DataTable } from './data-table';
import { columns } from './columns';
import { currentUser } from '@clerk/nextjs/server';

export default async function QuestionsSlot() {
  let user, articles;
  try {
    user = await currentUser();
    articles = await prisma.article.findMany({
      where: {
        authorId: user?.id!,
        deletedAt: null
      }
    });
  } catch (err) {
    throw err;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className='font-bold text-lg'>Article List</h1>
      <DataTable columns={columns} data={articles} />
    </div>
  )
}
