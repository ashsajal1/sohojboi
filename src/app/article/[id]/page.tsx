import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import prisma from '@/lib/prisma';
import React from 'react'
import CommentForm from './comment-form';
import Comment from './comment'
import ReactMarkdown from 'react-markdown';

export default async function Page({ params }: { params: { id: string } }) {
    const articleId = params.id;

    const article = await prisma.article.findUnique({
        where: {
            id: articleId
        },
        include: {
            comments: {
                orderBy: {
                    createdAt: 'desc'
                }
            },
            upvotes: true
        }
    })
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>{article?.title}</CardTitle>
                    <CardDescription>
                        <ReactMarkdown>
                            {article?.content}
                        </ReactMarkdown>
                    </CardDescription>

                    <div>
                        <Button size={'sm'}>{article?.upvotes.length} Upvote</Button>
                    </div>

                    <h1 className='font-bold mt-3'>Enter comments  :</h1>
                    <CommentForm articleId={article?.id!} />
                </CardHeader>
                <CardContent>
                    {article?.comments.map(comment => (
                        <Comment key={comment.id} comment={comment} />
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}