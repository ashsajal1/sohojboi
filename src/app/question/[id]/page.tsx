import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import prisma from "@/lib/prisma"
import { isValidObjectId } from "@/lib/validate";
import { revalidatePath } from "next/cache";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { currentUser } from '@clerk/nextjs/server';
import { Answers } from "./answers";
import { Input } from "@/components/ui/input";
import { NotificationType } from "@prisma/client";

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

    return (
        <div className="mt-2">
            <Card>
                <CardHeader>
                    <CardTitle>
                        {question?.questionTitle}
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="mb-4 border-b flex flex-col pb-4">
                        <Badge variant={'secondary'}>Desciption : </Badge>
                        <p className="mt-2">{question?.questionDescription}</p>
                    </div>
                    <SignedIn>
                        <form action={postAnswer}>
                            <Textarea name="answerText" rows={6} placeholder="Enter your asnwer..."></Textarea>
                            <Input className="hidden" value={question?.userId} name="userId" />
                            <Button className="mt-3">Submit</Button>
                        </form>
                    </SignedIn>
                    <SignedOut>
                        <h3 className="font-bold text-muted-foreground text-xl"><Link className="text-primary border-b" href={'/login'}>Login</Link> to post your answer</h3>
                    </SignedOut>

                </CardContent>

                <CardFooter className="flex flex-col items-start">
                    <Answers question={question} answers={answers} />
                </CardFooter>
            </Card>
        </div>
    )
}


