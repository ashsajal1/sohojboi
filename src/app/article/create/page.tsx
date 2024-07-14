import prisma from "@/lib/prisma";
import CreateArticleForm from "./create-article";

export default async function page() {
    const topics = await prisma.topic.findMany()
    return (
        <div>
            <CreateArticleForm topics={topics} />
        </div>
    )
}
