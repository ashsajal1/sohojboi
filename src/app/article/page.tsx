import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import prisma from '@/lib/prisma'
import React from 'react'

export default async function Page() {
    const articles = await prisma.article.findMany({
        include: {
            comments: true
        }
    })
    return (
        <div>
            {articles.map(article => <Card key={article.id}>
                <CardHeader>
                    <CardTitle>{article.title}</CardTitle>
                </CardHeader>
                <CardFooter>
                    <Button>View</Button>
                    <Button>Upvote</Button>
                </CardFooter>
            </Card>)}

            {articles.length === 0 && <h1 className='font-bold text-xl text-center p-12'>No articles Found!</h1>}
        </div>
    )
}
