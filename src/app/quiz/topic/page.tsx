import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import prisma from "@/lib/prisma"
import CreateTopic from "./create-topic"

export default async function TopicPage() {
    const topics = await prisma.topic.findMany()
    return (
        <div>
            <Card>
                <CardContent>
                    <CardHeader>
                        <CardTitle>Here is the list of topics</CardTitle>
                    </CardHeader>
                    <div className="flex items-center gap-2 flex-wrap">
                        {topics.map(topic => (
                            <Badge key={topic.id}>{topic.name}</Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <CreateTopic />
        </div>
    )
}
