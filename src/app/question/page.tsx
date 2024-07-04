import prisma from "@/lib/prisma"
import QuestionCard from "./question-card";

export default async function Question() {
    const questions = await prisma.question.findMany();
    // console.log(questions)
    return (
        <div className="p-4">
            {questions.map(question => (
                <QuestionCard key={question.id} question={question} />
            ))}
        </div>
    )
}
