import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import SeriesForm from "./form"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "My Blog Series | Sohojboi",
    description:
        "Group your articles into a series so students can read a topic from the first chapter to the last. Create, manage and share your Sohojboi blog series here.",
    alternates: { canonical: "/series" },
}

export default async function SeriesPage() {
    const { userId, redirectToSignIn } = await auth()
    if (!userId) return redirectToSignIn()
    const series = await prisma.blogSeries.findMany({
        where: {
            userId
        }
    })
    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">My blog series</h1>

            {series.length === 0 && <p>No Series Found!</p>}

            {series.map((series) => (
                <Link href={`/series/${series.id}`} key={series.id}>{series.title}</Link>
            ))}

            <h2 className="font-bold text-lg">Create series</h2>

            <SeriesForm userId={userId} />
        </div>
    )
}
