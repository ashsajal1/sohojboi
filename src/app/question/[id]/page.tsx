import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma"
import { isValidObjectId } from "@/lib/validate";
import { Show } from "@clerk/nextjs";
import Link from "next/link";
import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { Answers } from "./answers";
import { type Question } from "@prisma/client";
import UpvoteBtn from "../upvote-btn";
import ProfileImgCard from "@/components/profile-img-card";
import { chekcIsQuestionUpvoted } from "@/lib/utils";
import { DotsHorizontalIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
// import dropdown component
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AnswerForm from "./answer-form";
import { increaseView } from "./actions";
import ReactMarkDown from 'react-markdown';
import { Metadata } from "next";
import ShareBtn from "@/components/share-btn";
import BoxReveal from "@/components/magicui/box-reveal";

interface Params {
    params: Promise<{
        id: string
    }>
}

export async function generateMetadata(props: Params): Promise<Metadata> {
    const params = await props.params;
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

    const author = await (await clerkClient()).users.getUser(question?.userId!);
    const profileImg = await author.imageUrl;
    const authorName = await author.fullName;
    const formattedDate = new Date(question?.createdAt!).toLocaleDateString('en-US', {
        day: 'numeric',
        year: 'numeric',
        month: 'short',
    });

    const ogImage = `/api/og?title=${encodeURIComponent(question?.content ?? "Sohojboi")}&profileImg=${encodeURIComponent(profileImg)}&date=${encodeURIComponent(formattedDate)}&authorName=${encodeURIComponent(authorName ?? "")}`

    // Keep the description long enough for search results (120-160 chars).
    const rawText = (question?.description ?? "")
        .replace(/[#*_>`\n\r]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    const description =
        rawText.length >= 120
            ? `${rawText.slice(0, 155).trim()}…`
            : `${rawText ? `${rawText} ` : ''}Read the answers and opinions shared by the Sohojboi community, and add your own answer to help this student learn faster.`;

    return {
        title: question?.content,
        description,
        alternates: { canonical: `/question/${params.id}` },
        openGraph: {
            type: 'article',
            title: question?.content,
            description,
            url: `/question/${params.id}`,
            images: [{ url: ogImage, width: 1200, height: 630, alt: question?.content ?? 'Sohojboi question' }]
        }
    }
}
export default async function Question(props: Params) {
    const params = await props.params;
    const user = await currentUser();
    let question = null;

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
                        },
                        include: {
                            comments: {
                                where: {
                                    deletedAt: null
                                }
                            },
                        }
                    },
                    topic: true,
                }
            });

        } catch (error) {
            throw new Error('Error fetching question:', error!);
        }
    } else {
        throw new Error('Invalid ObjectId');
    }

    const isAnswered = await prisma.answer.findFirst({
        where: {
            questionId: question?.id!,
            userId: user?.id!,
            deletedAt: null,
        }
    });

    if (user?.id) {
        increaseView(user?.id!, question?.id!)
    }

    const isUpvotedQuestion = await chekcIsQuestionUpvoted(user?.id!, question?.id!);

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
                        <BoxReveal>
                            <CardTitle as="h1" className="py-2 text-xl">
                                {question?.content}
                            </CardTitle>
                        </BoxReveal>
                        {user?.id === question?.userId && <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size='sm' variant='ghost' aria-label='Question actions'><DotsHorizontalIcon /></Button>
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
                            {question?.description}
                        </ReactMarkDown>
                    </CardDescription>

                    <div className="flex items-center gap-2 text-sm">
                        <p>{viewCount._sum.count} <span className="ml-1">views</span></p>
                        <Button variant="link">{question?.topic?.name}</Button>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="flex items-center justify-between mb-4 mt-2 border-b pb-4">
                        <ProfileImgCard type="question" createdAt={question?.createdAt || new Date()} userId={question?.userId || ''} />

                        <div className="flex items-center gap-2">
                            <UpvoteBtn isUpvotedQuestion={isUpvotedQuestion} question={question || {} as Question} actorId={user?.id || ''} />
                            <ShareBtn title={question?.content!} description={question?.description.slice(0, 100)!} />
                        </div>
                    </div>

                    <Show when="signed-in">
                        {isAnswered === null && <AnswerForm question={question} />}
                    </Show>
                    <Show when="signed-out">
                        <h2 className="font-bold text-muted-foreground text-xl"><Link className="text-primary border-b" href={'/login'}>Login</Link> to post your answer</h2>
                    </Show>

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


