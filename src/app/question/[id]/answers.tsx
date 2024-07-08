import { Badge } from "@/components/ui/badge";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Upvote from "./upvote";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Question, type Answer } from "@prisma/client";
import Image from "next/image";
import { formatDate } from "@/lib/date-format";
import Link from "next/link";
import prisma from "@/lib/prisma";

interface AnswersProps {
    answers: Answer[];
    question: Question | null
}



export const Answers = async ({ answers, question }: AnswersProps) => {

    if (answers.length === 0) {
        return <h2 className="font-bold text-xl text-center text-muted-foreground">
            Answers is empty!
        </h2>
    }

    return <div className="flex flex-col gap-2 w-full">
        <Badge variant={'secondary'} className="mb-4">Community answers :</Badge>
        {answers.map(answer => (
            <Answer question={question} key={answer.id} answer={answer} />
        ))}
    </div>
}

const Answer = async ({ answer, question }: { answer: Answer, question: Question | null }) => {
    let answeredUser;
    let currentUser;
    let profileImageSrc;
    const user = await auth()
    let isUpvotedAnswer;

    isUpvotedAnswer = await prisma.upvote.findUnique({
        where: {
            userId_answerId: {
                userId: user.userId || '',
                answerId: answer.id
            }
        }
    })
    isUpvotedAnswer = !!isUpvotedAnswer
    try {
        answeredUser = await clerkClient().users.getUser(answer.userId);
        profileImageSrc = answeredUser.imageUrl;
        currentUser = await auth();
    } catch (error: any) {
        // throw new Error(error.message)
    }

    return <Card>
        <CardHeader>
            <CardTitle>
                {answer.answer}
            </CardTitle>
        </CardHeader>

        <CardFooter>
            <div className="flex items-center justify-between w-full">
                <Upvote isUpvotedAnswer={isUpvotedAnswer || false} question={question} userId={currentUser?.userId || ''} answer={answer} />

                <Link className="flex items-center gap-2" href={`/profile?id=${answer.userId}`}>
                    {profileImageSrc && <Image className="rounded-full" width={30} height={30} src={profileImageSrc} alt={"Profile image"} />}
                    <p className="flex flex-col">
                        {answer.userFullName}
                        <span className="text-sm text-muted-foreground">Answered {formatDate(answer.createdAt)}</span>
                    </p>
                </Link>
            </div>

        </CardFooter>
    </Card>
}