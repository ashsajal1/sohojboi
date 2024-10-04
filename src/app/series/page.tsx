import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import SeriesForm from "./form"
import Link from "next/link"

export default async function SeriesPage() {
    const user = auth()
    const series = await prisma.blogSeries.findMany({
        where: {
            userId: user.userId!
        }
    })
    return (
        <div className="p-4">

            {series.length === 0 && <p>No Series Found!</p>}

            {series.map((series) => (
                <Link href={`/series/${series.id}`} key={series.id}>{series.title}</Link>
            ))}

            <h1 className="font-bold text-lg">Create series</h1>

            <SeriesForm userId={user.userId!} />
        </div>
    )
}
