import prisma from "@/lib/prisma";
import CreateForm from "./create-form";

export default async function page() {
  const topics = await prisma.topic.findMany()
  return (
    <div>
      <CreateForm topics={topics} />
    </div>
  )
}
