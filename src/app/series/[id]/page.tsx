import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server";
import { EditIcon } from "lucide-react";
import Link from "next/link"
import AddArticle from "./add-article";
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Markdown from 'react-markdown'
import ProfileImgCard from '@/components/profile-img-card'
import Views from "@/app/article/[id]/views";

export default async function Series({ params }: { params: { id: string } }) {
    const series = await prisma.blogSeries.findUnique({
        where: {
            id: params.id!
        },
        include: {
            articles: true
        }
    })

    const user = await auth();
    const isAuthor = user.userId === series?.userId;

    return (
        <div>
            <div className="flex justify-between items-center">
                <h1 className="font-bold text-lg">{series?.title}</h1>
                {isAuthor && <Button size='icon' variant={'ghost'}>
                    <EditIcon className="h-5 w-5" />
                </Button>}
            </div>
            <p className="text-sm text-muted-foreground/70">{series?.description}</p>

            <div className='grid md:grid-cols-2 gap-2 py-2'>           
            {series?.articles.map((article) => (
                <Card key={article.id}>
                <CardHeader>
                    <CardTitle>{article.title}</CardTitle>
                    <Markdown className={'text-sm text-muted-foreground'}>
                        {article?.content?.replace(/\n/g, ' ').slice(0, 260)}
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
            </Card>
            ))}
            </div>

            {isAuthor && <AddArticle userId={user.userId} seriesId={params.id} />}
        </div>
    )
}
