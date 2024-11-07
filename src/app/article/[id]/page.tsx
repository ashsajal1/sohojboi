import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import prisma from '@/lib/prisma';
import React from 'react'
import CommentForm from './comment-form';
import Comment from './comment'
import { Metadata } from 'next';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { increaseView } from '@/app/_actions/increase-view';
import ProfileImgCard from '@/components/profile-img-card';
import UpvoteArticle from './upvote';
import Content from '../../../components/content';
import Link from 'next/link';
import ShareBtn from '@/components/share-btn';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DotsHorizontalIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import ArticleQuestion from './quiz';
import QuizComponent from '@/app/quiz/quizzes';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const articleId = params.id;
    let article;
    try {
        article = await prisma.article.findUnique({
            where: {
                id: articleId
            }
        });
    } catch (err) {
        throw new Error("Invalid article id!")
    }

    const author = await clerkClient().users.getUser(article?.authorId!);
    const profileImg = await author.imageUrl;
    const authorName = await author.fullName;
    const formattedDate = new Date(article?.createdAt!).toLocaleDateString('en-US', {
        day: 'numeric',
        year: 'numeric',
        month: 'short',
    });

    const ogImage = `/api/og?title=${article?.title}&profileImg=${profileImg}&date=${formattedDate}&authorName=${authorName}`

    return {
        title: article?.title,
        description: article?.content?.slice(1, 150),
        openGraph: {
            images: [ogImage]
        }
    }
}

export default async function Page({ params }: { params: { id: string } }) {
    const articleId = params.id;
    const userId = await auth().userId;
    let isUpvoted;
    let article;
    let relatedArticles;
    let quiz;

    try {
        article = await prisma.article.findUnique({
            where: {
                id: articleId
            },
            include: {
                comments: {
                    where: {
                        parentId: null,
                        deletedAt: null
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                },
                upvotes: true,
                blogSeries: {
                    include: {
                        articles: true
                    }
                },
                sections: true
            }
        })

        relatedArticles = await prisma.article.findMany({
            where: {
                topicId: article?.topicId,
                id: {
                    not: article?.id
                }
            },
            take: 3,
            orderBy: {
                createdAt: 'desc'
            }
        });

        quiz = await prisma.challengeQuestion.findMany({
            where: {
                articleId: articleId
            },
            include: {
                options: true
            }
        })
    } catch (err) {
        throw new Error("Invalid article id!")
    }


    if (userId) {
        isUpvoted = await prisma.upvote.findUnique({
            where: {
                userId_articleId: {
                    userId: userId!,
                    articleId: articleId
                }
            }
        })
    }

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

   const wordsPerMinute = 200;

const timeToRead = article?.content
    ? (article.content.split(" ").length / wordsPerMinute).toFixed(0)
    : (
        (article?.sections || [])
            .map(section => section.content || "")
            .join(" ")
            .split(" ").length / wordsPerMinute
    ).toFixed(0);

    const isInSeries = article?.blogSeriesId !== null

    return (
        <div>
            <Card>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div className='flex flex-col gap-2'>
                            <CardTitle>{article?.title}</CardTitle>
                            <span className="text-sm font-light text-muted-foreground/70">{timeToRead} mins read</span>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size='sm' variant='ghost'><DotsHorizontalIcon /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>

                                {userId === article?.authorId && <>
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <Link className="w-full" href={`/article/edit/${article?.id}`}>
                                            <DropdownMenuItem className="w-full">
                                                <Pencil1Icon className="mr-1" />
                                                Edit</DropdownMenuItem>
                                        </Link>
                                        <Link className="w-full" href={`/article/edit/${article?.id}`}>
                                            <DropdownMenuItem className="w-full">
                                                <TrashIcon className="mr-1" />
                                                Delete</DropdownMenuItem>
                                        </Link>

                                    </DropdownMenuGroup>
                                </>}
                                <DropdownMenuSeparator />

                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>
                                        Reports
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem className="w-full">
                                        <TrashIcon className="mr-1" />
                                        Spam</DropdownMenuItem>
                                </DropdownMenuGroup>

                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>

                    <CardDescription>
                        {isInSeries && (
                            <div className='flex flex-col gap-2 py-2'>
                                <p>This article is a part of <Link className='text-blue-500 underline' href={`/series/${article?.blogSeriesId}`}>{article?.blogSeries?.title}</Link> series.</p>
                                {article?.blogSeries?.articles.map((article, index) => (
                                    <Link className="w-full" href={`/article/${article.id}`} key={article.id}>
                                        <Button className="w-full text-start" variant={article.id === params.id ? 'secondary' : 'outline'}>#{index + 1} {article.title.slice(0, 40)}...</Button>
                                    </Link>
                                ))}

                            </div>
                        )}
                        {article?.sections.map(section => (
                            <Content
                                key={section.id}
                                content={`## **${section.title}**\n\n${section.content}`}
                            />
                        ))}
                        {article?.content && <Content content={article?.content!} />}

                        {quiz.length > 0 && <div>
                            <ArticleQuestion showConfetti question={quiz[0]} />
                        </div>}

                        <div className="py-2">
                            <Link href={`/quiz/create?articleId=${article?.id}`}>
                                <Button
                                    variant={'outline'}
                                    className="w-full">Create quiz on this article</Button>
                            </Link>

                        </div>
                        <p className='mt-2'> {viewCount._sum.count || 0} views </p>
                    </CardDescription>

                    <div className='flex items-center justify-between py-3'>
                        <ProfileImgCard createdAt={article?.createdAt} type={'article'} userId={article?.authorId!} />

                        <div className='flex items-center gap-2'>
                            <UpvoteArticle upvoteCount={article?.upvotes.length!} article={article!} isUpvoted={!!isUpvoted} />
                            <ShareBtn title={article?.title!} description={article?.content?.slice(0, 150)!} />
                        </div>
                    </div>

                    <h1 className='font-bold mt-3'>Enter comments  :</h1>
                    {userId ? <CommentForm articleId={articleId} /> : <p>Please <Link className="border-b" href='/login'>Login</Link> to comment</p>}

                    <div>
                        <p>Read more</p>
                        <div className="flex flex-col gap-2">
                            {relatedArticles.map(article => (
                                <Link className='text-blue-500 hover:underline' href={`/article/${article.id}`} key={article.id}>{article.title}</Link>
                            ))}
                        </div>

                    </div>
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
