import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import UpvoteBtn from "./upvote-btn";

interface QuestionProps {
    question: {
        id: string;
        userId: string;
        questionTitle: string;
        questionDescription: string;
        upvoteCount: number;
    }
}
export default function QuestionCard({ question }: QuestionProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{question.questionTitle}</CardTitle>
            </CardHeader>

            <CardFooter className="flex items-center gap-3">
                <Link href={`/question/${question.id}`}><Button>Answer</Button></Link>
                <UpvoteBtn id={question.id} upvoteCount={question.upvoteCount} />
            </CardFooter>
        </Card>
    )
}
