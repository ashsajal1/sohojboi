import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import prisma from '@/lib/prisma';
import React from 'react'

export default async function Page({ params }: { params: { id: string } }) {
    const articleId = params.id;

    const article = await prisma.article.findUnique({
        where: {
            id: articleId
        },
        include: {
            comments: true
        }
    })
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>{article?.title}</CardTitle>
                    <CardDescription>
                        {article?.content}
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    )
}
