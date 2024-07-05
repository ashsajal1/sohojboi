import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Upvote from "./upvote";

interface AnswersParams {
    id: string;
    userId: string;
    questionId: string;
    answer: string;
    upvoteCount: number;
    userFullName: string;
}

interface AnswersProps {
    answers: AnswersParams[];
}
export const Answers = (answers: AnswersProps) => {

    if (answers.answers.length === 0) {
        return <h2 className="font-bold text-xl text-center text-muted-foreground">
            Answers is empty!
        </h2>
    }

    return <div className="flex flex-col gap-2 w-full">
        <Badge variant={'secondary'} className="mb-4">Community answers :</Badge>
        {answers.answers.map(answer => (
            <Card key={answer.id}>
                <CardHeader>
                    <CardTitle>{answer.userFullName}</CardTitle>
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