import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import prisma from '@/lib/prisma';
import React from 'react'

export default async function Page({ params }: { params: { id: string } }) {
    const articleId = params.id;

    const article = await prisma.article.findUnique({
        where: {
            id: articleId
        },
        include: {
            comments: true,
            upvotes: true
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

                    <div>
                        <Button size={'sm'}>{article?.upvotes.length} Upvote</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {article?.comments.map(comment => (
                        <Card key={comment.id}>
                            <CardHeader>
                                <CardDescription>{comment.content}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
