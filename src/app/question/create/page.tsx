import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import CreateForm from "./create-form";
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
      <Card>
        <CardHeader>
          <CardTitle>Create question</CardTitle>
        </CardHeader>
        <CreateForm topics={topics} />
      </Card>
    </div>
  )
}
