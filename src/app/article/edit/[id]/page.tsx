import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import React from 'react'
import EditArticleForm from './edit-article-form';

export default async function Page({ params }: { params: { id: string } }) {
    const articleId = params.id;
    const userId = await auth().userId;

    const article = await prisma.article.findUnique({
        where: {
            id: articleId
        },
        include: {
            sections: true
        }
    });
    

    if(article?.authorId !== userId) {
        throw new Error("Unauthorized access!")
    }
    const topics = await prisma.topic.findMany()

    return (
        <div>
            <EditArticleForm article={article!} topics={topics} />
        </div>
    )
}
