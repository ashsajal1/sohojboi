import prisma from "@/lib/prisma"
import QuestionCard from "./question/question-card";

export default async function Home() {
  const questions = await prisma.question.findMany();
  // console.log(questions)
  return (
    <div className="p-4 flex flex-col gap-2">
      {questions.map(question => (
        <QuestionCard key={question.id} question={question} />
      ))}
    </div>
  )
}
