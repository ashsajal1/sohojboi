import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import prisma from '@/lib/prisma'
import { ArrowLeft, ArrowRight, PlusIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import Markdown from 'react-markdown'
import Views from './[id]/views'
import ProfileImgCard from '@/components/profile-img-card'
import NextBtn from '../question/next-btn'
import PreviousBtn from '../question/previous-btn'
import GridPattern from "@/components/magicui/grid-pattern";
import { cn } from "@/lib/utils";

export default async function Page(props: { searchParams: Promise<{ page: string }> }) {
    const searchParams = await props.searchParams;
    const page = parseInt(searchParams.page) || 1;
    const skipSize = (page - 1) * 10;
    const totalArticles = await prisma.article.count();

    const articles = await prisma.article.findMany({
        skip: skipSize,
        take: 10,
        where: {
            deletedAt: null
        },
        include: {
            comments: true,
            sections: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const hasMoreArticles = totalArticles > skipSize + articles.length;

    return (
        <div>
            <GridPattern
                width={30}
                height={30}
                x={-1}
                y={-1}
                strokeDasharray={"4 2"}
                className={cn(
                    "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)] -z-10 fixed",
                )}
            />
            <div className='fixed bottom-12 right-12'>
                <Link href='/article/create'>
                    <Button size={'icon'} variant={'destructive'}>
                        <PlusIcon />
                    </Button>
                </Link>
            </div>
            <div className='grid md:grid-cols-2 gap-2'>
                {articles.map(article => <Card key={article.id}>
                    <CardHeader>
                        <CardTitle>{article.title}</CardTitle>
                        <Markdown className={'text-sm text-muted-foreground'}>
                            {article?.content && article?.content?.replace(/\n/g, ' ').slice(0, 260)}

                        </Markdown>
                        <Markdown className={'text-sm text-muted-foreground'}>
                            {article?.sections[0]?.content?.replace(/\n/g, ' ').slice(0, 260)}

                        </Markdown>
                    </CardHeader>
                    <CardFooter>
                        <div className='flex items-center justify-between w-full'>
                            <ProfileImgCard type={'article'} userId={article.authorId} createdAt={article.createdAt} />
                            <div className='flex justify-end items-center gap-2'>
                                <Views articleId={article.id} />
                                <Link href={`/article/${article.id}`}>
                                    <Button variant={'ghost'}>Read more</Button>
                                </Link>
                            </div>
                        </div>
                    </CardFooter>
                </Card>)}
            </div>
            {articles.length === 0 && <h1 className='font-bold text-xl text-center p-12'>No articles Found!</h1>}
            <div className='mt-2 flex items-center justify-between gap-2'>
                {page > 1 ? (
                    <>
                        <PreviousBtn page={page - 1} />

                        {hasMoreArticles && <Link className='ml-auto w-full md:w-auto' href={`/article?page=${page + 1}`}>
                            <Button className='w-full md:w-auto'>
                                Next Page
                                <ArrowRight className='h-4 w-4 ml-2' />
                            </Button>
                        </Link>}
                    </>
                ) : (
                    hasMoreArticles && <>
                        <NextBtn page={page + 1} />
                    </>
                )}
            </div>
        </div>
    );
}
