import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma"

export default async function Home() {
  const questions = await prisma.question.findMany();
  console.log(questions)
  return (
    <div className="p-4">
      {questions.map(question => (
        <Card key={question.id}>
          <CardHeader>
          <CardTitle>{question.question}</CardTitle>
          </CardHeader>

          <CardFooter className="flex items-center gap-3">
            <Button>Answer</Button>
            <Button variant={'outline'}>Upvote</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
