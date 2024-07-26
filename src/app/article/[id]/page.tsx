import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import prisma from '@/lib/prisma';
import React from 'react'
import CommentForm from './comment-form';
import Comment from './comment'
// import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { increaseView } from '@/app/_actions/increase-view';
import ProfileImgCard from '@/components/profile-img-card';
import UpvoteArticle from './upvote';
import Views from './views';
import { Badge } from '@/components/ui/badge';
import Content from './content';

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
            upvotes: true,
        }
    })

    const isUpvoted = await prisma.upvote.findUnique({
        where: {
            userId_articleId: {
                userId: userId!,
                articleId: articleId
            }
        }
    })

    const viewCount = await prisma.view.aggregate({
        _sum: {
            count: true,
        },
        where: {
            articleId: {
                in: [articleId]
            }
        }
    })

    if (userId) {
        await increaseView(userId, article?.id!, "article")
    }

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>{article?.title}</CardTitle>
                    <CardDescription>
                        <Content content={article?.content!} />
                        <Badge className='mt-3' variant={'outline'}>
                            <Views articleId={articleId} />
                        </Badge>
                    </CardDescription>

                    <div className='flex items-center justify-between py-3'>
                        <ProfileImgCard createdAt={article?.createdAt} type={'article'} userId={article?.authorId!} />

                        <UpvoteArticle upvoteCount={article?.upvotes.length!} article={article!} isUpvoted={!!isUpvoted} />
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
