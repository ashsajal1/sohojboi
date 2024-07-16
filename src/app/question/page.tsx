import prisma from "@/lib/prisma"
import QuestionCard from "./question-card";
import { Card, CardTitle } from "@/components/ui/card";

import { Metadata } from "next";
import InfiniteQuestions from "./infinite-questions";

export const metadata: Metadata = {
    title: "Explore Questions on Various Topics | Sohojboi",
    description: "Discover and engage with a wide range of questions on diverse topics. Join the Sohojboi community to ask, answer, and learn interactively.",  
}

export default async function Question() {
    const questions = await prisma.question.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        take: 10
    });
 
    if(questions.length === 0) {
        return <Card className="p-4 m-12">
            <CardTitle>Question is empty!</CardTitle>
        </Card>
    }
    return (
        // <div className="p-4 grid md:grid-cols-2 gap-2">
        //     {questions.map(question => (
        //         <QuestionCard key={question.id} question={question} />
        //     ))}
        // </div>
        <InfiniteQuestions />
    )
}
