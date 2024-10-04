import prisma from "@/lib/prisma"
import Link from "next/link"

export default async function Series({ params }: { params: { id: string } }) {
    const series = await prisma.blogSeries.findUnique({
        where: {
            id: params.id!
        },
        include: {
            articles: true
        }
    })

    return (
        <div>
            <h1 className="font-bold text-lg">{series?.title}</h1>
            <p className="text-sm text-muted-foreground/70">{series?.description}</p>

            {series?.articles.map((article) => (
                <Link href={`/article/${article.id}`} key={article.id}>{article.title}</Link>
            ))}
        </div>
    )
}
