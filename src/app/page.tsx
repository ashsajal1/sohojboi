import prisma from "@/lib/prisma"
import QuestionCard from "./question/question-card";
import { Card, CardTitle } from "@/components/ui/card";

export default async function Home() {
  const questions = await prisma.question.findMany();
  // console.log(questions)
  if(questions.length === 0) {
    return <Card className="p-4 m-12">
        <CardTitle>Question is empty!</CardTitle>
    </Card>
}
  return (
    <div className="p-4 flex flex-col gap-2">
      {questions.map(question => (
        <QuestionCard key={question.id} question={question} />
      ))}
    </div>
  )
}
