import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardFooter, CardHeader, } from "@/components/ui/card";
import Upvote from "./upvote";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { Question, type Answer } from "@prisma/client";
import { chekcIsAnswerUpvoted } from "@/lib/utils";
import ProfileImgCard from "@/components/profile-img-card";
import { Button } from "@/components/ui/button";
import { GearIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import Link from "next/link";
import DeleteAnswer from "./delete-answer";
import EditAnswer from "./edit-answer";

interface AnswersProps {
    answers: Answer[];
    question: Question | null
}

export const Answers = async ({ answers, question }: AnswersProps) => {
    const user = await currentUser();
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
            <CardDescription>
                {answer.answer}
            </CardDescription>
        </CardHeader>

        <CardFooter>
            <div className="flex items-center justify-between w-full">
                <ProfileImgCard profileImageSrc={profileImageSrc || ''} fullName={answer.userFullName} type={"answer"} userId={answer.userId} createdAt={answer.createdAt || new Date()} />

                <div className="flex items-center gap-2">
                    {user.userId === answer?.userId && <HoverCard>
                        <HoverCardTrigger>
                            <Button size='sm' variant='outline'><GearIcon /></Button>
                        </HoverCardTrigger>
                        <HoverCardContent>
                            <div className="flex items-center gap-2 justify-between">
                                <EditAnswer answerId={answer.id} answerText={answer.answer} />
                                <DeleteAnswer questionId={answer.questionId} answerId={answer.id} />
                            </div>
                        </HoverCardContent>
                    </HoverCard>}
                    <Upvote isUpvotedAnswer={isUpvotedAnswer || false} question={question} userId={currentUser?.userId || ''} answer={answer} />
                </div>
            </div>

        </CardFooter>
    </Card>
}