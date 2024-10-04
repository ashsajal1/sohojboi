import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

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
                <p key={series.id}>{series.title}</p>
            ))}

            <h1 className="font-bold text-lg">Create series</h1>

            <form>
                <Input placeholder="Series name eg. Javascript tutorials, Biolgy chapter 1" />
                <Button className="mt-2">Create</Button>
            </form>
        </div>
    )
}
