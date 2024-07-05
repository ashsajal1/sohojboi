import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import prisma from "@/lib/prisma"
import { isValidObjectId } from "@/lib/validate";
import { revalidatePath } from "next/cache";
import Upvote from "./upvote";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

interface Params {
    params: {
        id: string
    }
}

export default async function Question({ params }: Params) {
    const postAnswer = async (formData: FormData) => {
        "use server"
        const answerText = await formData.get("answerText");
        if (answerText) {
            const answer = await prisma.answer.create({
                data: {
                    userId: "123",
                    questionId: params.id,
                    upvoteCount: 0,
                    answer: answerText as string,
                },
            });

            revalidatePath('')

            // console.log(answer)
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
            });
        } catch (error) {
            throw new Error('Error fetching question:', error || '');
        }
    } else {
        throw new Error('Invalid ObjectId');
    }

    // console.log(question)
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>
                        {question?.questionTitle}
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div>{question?.questionDescription}</div>
                    <SignedIn>
                        <form action={postAnswer}>
                            <Textarea name="answerText" rows={6} placeholder="Enter your asnwer..."></Textarea>
                            <Button className="mt-3">Submit</Button>
                        </form>
                    </SignedIn>
                    <SignedOut>
                        <h3 className="font-bold text-muted-foreground text-xl"><Link className="text-primary border-b" href={'/login'}>Login</Link> to post your answer</h3>
                    </SignedOut>

                </CardContent>

                <CardFooter className="flex flex-col items-start">
                    <h2 className="mb-4">Others answers :</h2>

                    <Answers answers={answers} />
                </CardFooter>
            </Card>
        </div>
    )
}


interface AnswersParams {
    id: string;
    userId: string;
    questionId: string;
    answer: string;
    upvoteCount: number;
}

interface AnswersProps {
    answers: AnswersParams[];
}
const Answers = (answers: AnswersProps) => {

    if (answers.answers.length === 0) {
        return <h2 className="font-bold text-xl text-center text-muted-foreground">
            Answers is empty!
        </h2>
    }

    return <div className="flex flex-col gap-2 w-full">
        {answers.answers.map(answer => (
            <Card key={answer.id}>
                <CardHeader>
                    <CardTitle>John doe</CardTitle>
                </CardHeader>
                <CardContent>
                    {answer.answer}
                </CardContent>

                <CardFooter>
                    <Upvote id={answer.id} upvoteCount={answer.upvoteCount} />
                </CardFooter>
            </Card>
        ))}
    </div>
}