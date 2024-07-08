import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import UpvoteBtn from "./upvote-btn";
import { formatDate } from "@/lib/date-format";
import { auth } from "@clerk/nextjs/server";
import { Question } from "@prisma/client";
import prisma from "@/lib/prisma";

interface QuestionProps {
    question: Question;
}
export default async function QuestionCard({ question }: QuestionProps) {
    const actorId = await auth().userId;
    let isUpvotedQuestion;

    isUpvotedQuestion = await prisma.upvote.findUnique({
        where: {
            userId_questionId: {
                userId: actorId || '',
                questionId: question.id
            }
        }
    })
    isUpvotedQuestion = !!isUpvotedQuestion

    return (
        <Card>
            <CardHeader>
                <CardTitle>{question.questionTitle}</CardTitle>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span>Asked {formatDate(question.createdAt)} by</span>
                    <Link href={`/profile?id=${question.userId}`} className="text-primary border-b">{question.userFullName}</Link>
                </div>
            </CardHeader>

            <CardFooter className="flex items-center gap-3">
                <Link href={`/question/${question.id}`}><Button>Answer</Button></Link>
                <UpvoteBtn isUpvotedQuestion={isUpvotedQuestion} question={question} actorId={actorId || ''} />
            </CardFooter>
        </Card>
    )
}
