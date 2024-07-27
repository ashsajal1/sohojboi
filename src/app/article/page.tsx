import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import prisma from '@/lib/prisma'
import { ArrowLeft, ArrowRight, PlusIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import Markdown from 'react-markdown'
import Views from './[id]/views'
import ProfileImgCard from '@/components/profile-img-card'

export default async function Page({ searchParams }: { searchParams: { page: string } }) {
    const page = parseInt(searchParams.page) || 1;
    const skipSize = (page - 1) * 10;

    const articles = await prisma.article.findMany({
        skip: skipSize,
        take: 10,
        include: {
            comments: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div>
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
                            {article.content.replace(/\n/g, ' ').slice(0, 260)}
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
                {page > 1 && <Link href={`/article?page=${page - 1}`}>
                    <Button>
                        <ArrowLeft className='h-4 w-4 mr-2' />
                        Previous Page
                    </Button>
                </Link>}
                <Link href={`/article?page=${page + 1}`}>
                    <Button variant={'outline'}>
                        Next Page
                        <ArrowRight className='h-4 w-4 ml-2' />
                    </Button>
                </Link>
            </div>
        </div>
    )
}
