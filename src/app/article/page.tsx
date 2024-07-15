import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import prisma from '@/lib/prisma'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

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
            <div className='grid md:grid-cols-2 gap-2'>
                {articles.map(article => <Card key={article.id}>
                    <CardHeader>
                        <CardTitle>{article.title}</CardTitle>
                    </CardHeader>
                    <CardFooter>
                        <Link href={`/article/${article.id}`}>
                            <Button>View</Button>
                        </Link>
                        <Button>Upvote</Button>
                    </CardFooter>
                </Card>)}
            </div>
            {articles.length === 0 && <h1 className='font-bold text-xl text-center p-12'>No articles Found!</h1>}
            <div className='mt-2 flex items-center gap-2'>
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
