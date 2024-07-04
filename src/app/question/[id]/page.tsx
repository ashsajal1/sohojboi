import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import prisma from "@/lib/prisma"
import { isValidObjectId } from "@/lib/validate";

interface Params {
    params: {
        id: string
    }
}

export default async function Question({ params }: Params) {
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

    console.log(question)
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>
                        {question?.question}
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <Textarea rows={6} placeholder="Enter your asnwer..."></Textarea>
                    <Button className="mt-3">Submit</Button>
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
    answerId: string;
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

    return <div className="flex">
        {answers.answers.map(answer => (
            <Card key={answer.id}>
                <CardHeader>
                    <CardTitle>John doe</CardTitle>
                </CardHeader>
                <CardContent>
                    This is others answer
                </CardContent>

                <CardFooter>
                    <Button variant="outline">Upvote</Button>
                </CardFooter>
            </Card>
        ))}
    </div>
}