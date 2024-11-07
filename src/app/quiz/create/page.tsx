import prisma from "@/lib/prisma";
import CreateForm from "./create-form";

export default async function page() {
  const topics = await prisma.topic.findMany();
  const articles = await prisma.article.findMany();
  return (
    <div>
      <CreateForm topics={topics} articles={articles} />
    </div>
  )
}
