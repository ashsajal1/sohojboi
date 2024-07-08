import { Badge } from "@/components/ui/badge";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Upvote from "./upvote";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Question, type Answer } from "@prisma/client";
import Image from "next/image";
import { formatDate } from "@/lib/date-format";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { chekcIsAnswerUpvoted } from "@/lib/utils";
import ProfileImgCard from "@/components/profile-img-card";

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
    let isUpvotedAnswer = await chekcIsAnswerUpvoted(user.userId || '', answer.id);

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
                <ProfileImgCard profileImageSrc={profileImageSrc || ''} fullName={answer.userFullName} type={"answer"} userId={answer.userId} createdAt={answer.createdAt || new Date()} />

                <Upvote isUpvotedAnswer={isUpvotedAnswer || false} question={question} userId={currentUser?.userId || ''} answer={answer} />
            </div>

        </CardFooter>
    </Card>
}