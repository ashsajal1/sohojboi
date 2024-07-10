import prisma from "@/lib/prisma"
import { Card, CardTitle } from "@/components/ui/card";
import QuestionCard from "../question/question-card";
import Questions from "./questions";

export default async function QuestionsSlot() {
    const questions = await prisma.question.findMany({
        take: 10,
        orderBy: {
            createdAt: 'desc'
        }
    });
    if (questions.length === 0) {
        return <Questions>
            <Card className="p-4 m-12">
                <CardTitle>Question is empty!</CardTitle>
            </Card>
        </Questions>
    }
    return (
        <>
            <Questions>
                <div className="p-4 grid md:grid-cols-2 gap-2">
                    {questions.map(question => (
                        <QuestionCard key={question.id} question={question} />
                    ))}
                </div>
            </Questions>
        </>
    )
}
