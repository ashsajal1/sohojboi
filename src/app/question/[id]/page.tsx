import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma"
import { isValidObjectId } from "@/lib/validate";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { Answers } from "./answers";
import { type Question } from "@prisma/client";
import UpvoteBtn from "../upvote-btn";
import ProfileImgCard from "@/components/profile-img-card";
import { chekcIsQuestionUpvoted } from "@/lib/utils";
import { CaretUpIcon, DotsHorizontalIcon, EyeOpenIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
// import dropdown component
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AnswerForm from "./answer-form";
import { increaseView } from "./actions";
import ReactMarkDown from 'react-markdown';
import { Metadata } from "next";
import ShareBtn from "@/components/share-btn";

interface Params {
    params: {
        id: string
    }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    let question = null;

    if (isValidObjectId(params.id)) {
        try {
            question = await prisma.question.findUnique({
                where: {
                    id: params.id,
                },
                include: {
                    answers: true,
                    topic: true,
                }
            });

        } catch (error) {
            throw new Error('Error fetching question:', error || '');
        }
    } else {
        throw new Error('Invalid ObjectId');
    }

    const author = await clerkClient().users.getUser(question?.userId!);
    const profileImg = await author.imageUrl;
    const authorName = await author.fullName;
    const formattedDate = new Date(question?.createdAt!).toLocaleDateString('en-US', {
        day: 'numeric',
        year: 'numeric',
        month: 'short',
    });

    const ogImage = `/api/og?title=${question?.questionTitle}&profileImg=${profileImg}&date=${formattedDate}&authorName=${authorName}`

    return {
        title: question?.questionTitle,
        description: question?.questionDescription.slice(1, 150),
        openGraph: {
            images: [ogImage]
        }
    }
}
export default async function Question({ params }: Params) {
    const user = await currentUser();

    let question = null;
    let questionUser;

    if (isValidObjectId(params.id)) {
        try {
            question = await prisma.question.findUnique({
                where: {
                    id: params.id,
                },
                include: {
                    answers: {
                        where: {
                            deletedAt: null,
                        }
                    },
                    topic: true,
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
                        {user?.id === question?.userId && <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size='sm' variant='ghost'><DotsHorizontalIcon /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <div className="flex flex-col p-2 items-center gap-2 justify-between">
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
                            </DropdownMenuContent>
                        </DropdownMenu>}
                    </div>

                    <CardDescription>
                        <ReactMarkDown>
                            {question?.questionDescription}
                        </ReactMarkDown>
                    </CardDescription>

                    <div className="flex items-center gap-2">
                        <Badge variant={'secondary'}>
                            <EyeOpenIcon className="mr-2" />{viewCount._sum.count}
                        </Badge>
                        <Badge variant={'secondary'}>
                            <CaretUpIcon className="mr-2" />{question?.upvoteCount!}
                        </Badge>
                        <Badge>{question?.topic?.name}</Badge>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="flex items-center justify-between mb-4 mt-2 border-b pb-4">
                        <ProfileImgCard type="question" createdAt={question?.createdAt || new Date()} userId={question?.userId || ''} />

                        <div className="flex items-center gap-2">
                            <UpvoteBtn isUpvotedQuestion={isUpvotedQuestion} question={question || {} as Question} actorId={user?.id || ''} />
                            <ShareBtn title={question?.questionTitle!} description={question?.questionDescription.slice(0, 100)!} />
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
                    {question?.answers.length === 0 && <h2 className="font-bold text-xl text-center text-muted-foreground">
                        Answers is empty!
                    </h2>}
                    <Answers question={question} answers={question?.answers!} />
                </CardFooter>
            </Card>
        </div>
    )
}


