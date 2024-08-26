import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import UpvoteBtn from "./upvote-btn";
import { auth } from "@clerk/nextjs/server";
import { Question } from "@prisma/client";
import prisma from "@/lib/prisma";
import ProfileImgCard from "@/components/profile-img-card";
import { chekcIsQuestionUpvoted } from "@/lib/utils";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import { CornerDownRightIcon } from "lucide-react";
import BlurFade from "@/components/magicui/blur-fade";

interface QuestionProps {
    question: Question;
}
export default async function QuestionCard({ question }: QuestionProps) {
    const actorId = await auth().userId;
    let isUpvotedQuestion = await chekcIsQuestionUpvoted(actorId || '', question.id);

    const viewCount = await prisma.view.aggregate({
        _sum: {
            count: true,
        },
        where: {
            questionId: {
                in: [question?.id!]
            }
        }
    })

    return (

        <Card className="z-10">
            <BlurFade delay={0.25} inView>
                <CardHeader>
                    <CardTitle>{question.questionTitle}</CardTitle>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <span>Upvoted by {question.upvoteCount} people</span>
                        <Separator orientation="vertical" />

                        <div className="flex items-center gap-1">
                            <EyeOpenIcon className="mr-1" />
                            {viewCount._sum.count || 0}
                        </div>
                    </div>
                </CardHeader>

                <CardFooter className="flex items-center justify-between">

                    <ProfileImgCard type="question" createdAt={question.createdAt} userId={question.userId} />

                    <div className="flex items-center gap-2">
                        <Link href={`/question/${question.id}`}>
                            <Button variant={'link'} size={'sm'}><CornerDownRightIcon className="mr-2 h-4 w-4" />Answer</Button>
                        </Link>
                        <UpvoteBtn isUpvotedQuestion={isUpvotedQuestion} question={question} actorId={actorId || ''} />
                    </div>
                </CardFooter>
            </BlurFade>
        </Card >
    )
}
