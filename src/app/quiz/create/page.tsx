import prisma from "@/lib/prisma";
import CreateForm from "./create-form";

export default async function page() {
  const topics = await prisma.topic.findMany();
  const articles = await prisma.article.findMany({
    include: {
      sections: true,
    },
  });

  // Flatten sections from each article
  const articleSections = articles.flatMap((article) =>
    article.sections.map((section) => ({
      ...section,
      articleId: article.id,
    }))
  );

  return (
    <div>
      <CreateForm topics={topics} articles={articles} articleSections={articleSections} />
    </div>
  );
}
