import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import React from 'react'

export default async function Page({ searchParams }: { searchParams: { page: string } }) {
    const page = parseInt(searchParams.page) || 0;
    const skipSize = page * 10;

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

            {articles.length === 0 && <h1 className='font-bold text-xl text-center p-12'>No articles Found!</h1>}
            <div>
                <Link href={`/article?page=${page + 1}`}>
                    <Button>
                        Next Page
                    </Button>
                </Link>
            </div>
        </div>
    )
}
