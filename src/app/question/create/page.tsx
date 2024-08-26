import CreateQuestion from "./create-question";
import prisma from "@/lib/prisma";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Sohojboi: Write your question",
  description: "Sohojboi : Write your question",
};


export default async function Create() {
  const topics = await prisma.topic.findMany()
  return (
    <div className="p-4">
        <CreateQuestion topics={topics} />
    </div>
  )
}
