import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server";
import { EditIcon } from "lucide-react";
import Link from "next/link"
import AddArticle from "./add-article";

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

            {series?.articles.map((article) => (
                <Link href={`/article/${article.id}`} key={article.id}>{article.title}</Link>
            ))}
            {isAuthor && <AddArticle userId={user.userId} seriesId={params.id} />}
        </div>
    )
}
