import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import UpvoteBtn from "./upvote-btn";
import { formatDate } from "@/lib/date-format";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Question } from "@prisma/client";
import prisma from "@/lib/prisma";
import Image from "next/image";
import ProfileImgCard from "@/components/profile-img-card";

interface QuestionProps {
    question: Question;
}
export default async function QuestionCard({ question }: QuestionProps) {
    const actorId = await auth().userId;
    let isUpvotedQuestion;
    let profileImageSrc;
    let questionUser;

    isUpvotedQuestion = await prisma.upvote.findUnique({
        where: {
            userId_questionId: {
                userId: actorId || '',
                questionId: question.id
            }
        }
    })
    isUpvotedQuestion = !!isUpvotedQuestion

    try {
        questionUser = await clerkClient().users.getUser(question.userId);
        profileImageSrc = questionUser.imageUrl;
    } catch (error: any) {
        // throw new Error(error.message)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{question.questionTitle}</CardTitle>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span>Asked {formatDate(question.createdAt)} by</span>
                    <Link href={`/profile?id=${question.userId}`} className="text-primary border-b">{question.userFullName}</Link>
                </div>
            </CardHeader>

            <CardFooter className="flex items-center justify-between">

                <ProfileImgCard fullName={question.userFullName} type="question" createdAt={question.createdAt} profileImageSrc={profileImageSrc || ''} userId={question.userId} />

                <div className="flex items-center gap-2">
                    <Link href={`/question/${question.id}`}>
                        <Button size={'sm'}>Answer</Button>
                    </Link>
                    <UpvoteBtn isUpvotedQuestion={isUpvotedQuestion} question={question} actorId={actorId || ''} />
                </div>
            </CardFooter>
        </Card>
    )
}
