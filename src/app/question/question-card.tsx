import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import UpvoteBtn from "./upvote-btn";
import { formatDate } from "@/lib/date-format";

interface QuestionProps {
    question: {
        id: string;
        userId: string;
        questionTitle: string;
        questionDescription: string;
        upvoteCount: number;
        createdAt: Date;
        updatedAt: Date;
        userFirstName: string,
        userLastName: string,
        userFullName: string,
    }
}
export default function QuestionCard({ question }: QuestionProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{question.questionTitle}</CardTitle>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span>Asked {formatDate(question.createdAt)} by</span>
                    <Link href={`/user/${question.userId}`} className="text-primary border-b">{question.userFullName}</Link>
                </div>
            </CardHeader>

            <CardFooter className="flex items-center gap-3">
                <Link href={`/question/${question.id}`}><Button>Answer</Button></Link>
                <UpvoteBtn id={question.id} upvoteCount={question.upvoteCount} />
            </CardFooter>
        </Card>
    )
}
