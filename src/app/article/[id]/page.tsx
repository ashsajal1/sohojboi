import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import prisma from '@/lib/prisma';
import React from 'react'
import CommentForm from './comment-form';
import Comment from './comment'
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { increaseView } from '@/app/_actions/increase-view';
import ProfileImgCard from '@/components/profile-img-card';
import UpvoteArticle from './upvote';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const articleId = params.id;

    const article = await prisma.article.findUnique({
        where: {
            id: articleId
        }
    })
    return {
        title: article?.title,
        description: article?.content.slice(1, 150)
    }
}

export default async function Page({ params }: { params: { id: string } }) {
    const articleId = params.id;
    const userId = await auth().userId;

    const article = await prisma.article.findUnique({
        where: {
            id: articleId
        },
        include: {
            comments: {
                where: {
                    parentId: null
                },
                orderBy: {
                    createdAt: 'desc'
                },
            },
            upvotes: true
        }
    })

    if(userId) {
        await increaseView(userId, article?.id!, "article")
    }

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>{article?.title}</CardTitle>
                    <CardDescription>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {article?.content}
                        </ReactMarkdown>
                    </CardDescription>

                    <div className='flex items-center justify-between py-3'>
                        <ProfileImgCard createdAt={article?.createdAt} type={'article'} userId={article?.authorId!} />

                        <UpvoteArticle upvoteCount={article?.upvotes.length!} article={article!} isUpvotedAnswer={false} />
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
