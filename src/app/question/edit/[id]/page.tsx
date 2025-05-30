import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import prisma from "@/lib/prisma";
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from "next/navigation";
import DeleteQuestion from "./delete-question";
import EditQuestion from "./edit-question";

export default async function Create(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const userId = await (await currentUser())?.id;
    const questionId = params.id;

    const [questionData, topics] = await Promise.all([
        prisma.question.findUnique({
            where: {
                id: questionId
            }
        }),
        prisma.topic.findMany()
    ])

    if (questionData?.userId !== userId) {
        throw new Error("Unauthorized access!")
    }

    if ((!questionId && questionData)) {
        throw new Error("Please enter a valid question id!")
    }


    return (
        <div className="p-4">
            <EditQuestion topics={topics} question={questionData!} />
        </div>
    )
}
