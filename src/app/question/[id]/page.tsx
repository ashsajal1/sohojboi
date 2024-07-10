import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import prisma from "@/lib/prisma"
import { isValidObjectId } from "@/lib/validate";
import { revalidatePath } from "next/cache";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { Answers } from "./answers";
import { Input } from "@/components/ui/input";
import { NotificationType, type Question } from "@prisma/client";
import UpvoteBtn from "../upvote-btn";
import ProfileImgCard from "@/components/profile-img-card";
import { chekcIsQuestionUpvoted } from "@/lib/utils";
import { CaretUpIcon, DotsHorizontalIcon, EyeOpenIcon, GearIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import AnswerForm from "./answer-form";
import { increaseView } from "./actions";

interface Params {
    params: {
        id: string
    }
}

export default async function Question({ params }: Params) {
    const user = await currentUser();

    const postAnswer = async (formData: FormData) => {
        "use server"
        const answerText = await formData.get("answerText");
        const questionUserId = await formData.get("userId");
        if (answerText) {
            const answer = await prisma.answer.create({
                data: {
                    userId: user?.id as string,
                    questionId: params.id,
                    upvoteCount: 0,
                    answer: answerText as string,
                    userFirstName: user?.firstName as string,
                    userLastName: user?.lastName as string,
                    userFullName: user?.fullName as string,
                },
            });

            if (user?.id !== questionUserId) {
                const notif = await prisma.notification.create({
                    data: {
                        userId: questionUserId as string,
                        message: `${user?.fullName} has answered your questions.`,
                        type: NotificationType.ANSWER,
                        answerId: answer.id,
                        questionId: answer.questionId
                    }
                })
            }

            revalidatePath(`/question/${params.id}`)
        }
    }


    let question = null;
    let answers = null;
    let profileImageSrc;
    let questionUser;


    if (isValidObjectId(params.id)) {
        try {
            question = await prisma.question.findUnique({
                where: {
                    id: params.id,
                },
            });
            answers = await prisma.answer.findMany({
                where: {
                    questionId: params.id,
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

        } catch (error) {
            throw new Error('Error fetching question:', error || '');
        }
    } else {
        throw new Error('Invalid ObjectId');
    }

    try {
        questionUser = await clerkClient().users.getUser(question?.userId || "");
        profileImageSrc = questionUser.imageUrl;
    } catch (error: any) {
        // throw new Error(error.message)
    }

    if (user?.id) {
        increaseView(user?.id!, question?.id!)
    }

    const isUpvotedQuestion = await chekcIsQuestionUpvoted(user?.id || '', question?.id || '');

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
        <div className="mt-2">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle>
                            {question?.questionTitle}
                        </CardTitle>
                        {user?.id === question?.userId && <HoverCard>
                            <HoverCardTrigger>
                                <Button size='sm' variant='outline'><DotsHorizontalIcon /></Button>
                            </HoverCardTrigger>
                            <HoverCardContent>
                                <div className="flex items-center gap-2 justify-between">
                                    <Link className="w-full" href={`/question/edit/${question?.id}`}>
                                        <Button className="w-full" size={'sm'} variant={'secondary'}>
                                            <Pencil1Icon className="mr-1" />
                                            Edit</Button>
                                    </Link>
                                    <Link className="w-full" href={`/question/edit/${question?.id}`}>
                                        <Button className="w-full" size={'sm'} variant={'destructive'}>
                                            <TrashIcon className="mr-1" />
                                            Delete</Button>
                                    </Link>
                                </div>
                            </HoverCardContent>
                        </HoverCard>}
                    </div>

                    <CardDescription>
                        {question?.questionDescription}
                    </CardDescription>

                    <div className="flex items-center gap-2">
                        <Badge variant={'secondary'}>
                            <EyeOpenIcon className="mr-2" />{viewCount._sum.count}
                        </Badge>
                        <Badge variant={'secondary'}>
                            <CaretUpIcon className="mr-2" />{question?.upvoteCount!}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="flex items-center justify-between mb-4 mt-2 border-b pb-4">
                        <ProfileImgCard fullName={question?.userFullName || ''} type="question" createdAt={question?.createdAt || new Date()} profileImageSrc={profileImageSrc || ''} userId={question?.userId || ''} />

                        <div className="flex items-center gap-2">
                            {user?.id === question?.userId &&
                                <Link className="w-full" href={`/question/edit/${question?.id}`}>
                                    <Button className="w-full" size={'sm'} variant={'outline'}>
                                        <Pencil1Icon className="mr-1" />
                                        Edit</Button>
                                </Link>
                            }
                            <UpvoteBtn isUpvotedQuestion={isUpvotedQuestion} question={question || {} as Question} actorId={user?.id || ''} />
                        </div>
                    </div>

                    <SignedIn>
                        <AnswerForm question={question} />
                    </SignedIn>
                    <SignedOut>
                        <h3 className="font-bold text-muted-foreground text-xl"><Link className="text-primary border-b" href={'/login'}>Login</Link> to post your answer</h3>
                    </SignedOut>

                </CardContent>

                <CardFooter className="flex flex-col items-start">
                    {answers.length === 0 && <h2 className="font-bold text-xl text-center text-muted-foreground">
                        Answers is empty!
                    </h2>}
                    <Answers question={question} answers={answers} />
                </CardFooter>
            </Card>
        </div>
    )
}


