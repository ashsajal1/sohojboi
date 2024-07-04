import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma"
import Link from "next/link";

export default async function Home() {
  const questions = await prisma.question.findMany();
  // console.log(questions)
  return (
    <div className="p-4">
      {questions.map(question => (
        <Card key={question.id}>
          <CardHeader>
          <CardTitle>{question.question}</CardTitle>
          </CardHeader>

          <CardFooter className="flex items-center gap-3">
            <Link href={`/question/${question.id}`}><Button>Answer</Button></Link>
            <Button variant={'outline'}>Upvote</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
