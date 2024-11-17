import prisma from "@/lib/prisma";
import CreateForm from "./create-form";
import JsonInput from "./json-input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
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
      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Manual</TabsTrigger>
          <TabsTrigger value="json-input">Json Input</TabsTrigger>
        </TabsList>
        <TabsContent value="manual">
          <CreateForm topics={topics} articles={articles} articleSections={articleSections} />
        </TabsContent>
        <TabsContent value="json-input">
          <JsonInput topics={topics} articles={articles} articleSections={articleSections} />
        </TabsContent>
      </Tabs>


    </div>
  );
}
