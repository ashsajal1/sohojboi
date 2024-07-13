import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import prisma from "@/lib/prisma"
import CreateTopic from "./create-topic"
import { checkRole } from "@/lib/roles";

export default async function TopicPage() {
    const topics = await prisma.topic.findMany();
    const hasPermission = checkRole("admin") || checkRole("moderator");
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Here is the list of topics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 flex-wrap">
                        {topics.map(topic => (
                            <Badge key={topic.id}>{topic.name}</Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <CreateTopic hasPermission={hasPermission} />
        </div>
    )
}
