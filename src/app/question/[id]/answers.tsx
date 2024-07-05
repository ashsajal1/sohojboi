import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Upvote from "./upvote";
import { clerkClient } from "@clerk/nextjs/server";
import { type Answer } from "@prisma/client";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AnswersProps {
    answers: Answer[];
}
export const Answers = async (answers: AnswersProps) => {

    if (answers.answers.length === 0) {
        return <h2 className="font-bold text-xl text-center text-muted-foreground">
            Answers is empty!
        </h2>
    }

    return <div className="flex flex-col gap-2 w-full">
        <Badge variant={'secondary'} className="mb-4">Community answers :</Badge>
        {answers.answers.map(answer => (
            <Answer key={answer.id} answer={answer} />
        ))}
    </div>
}

const Answer = async ({ answer }: { answer: Answer }) => {
    let user;
    let profileImageSrc;
    try {
        user = await clerkClient().users.getUser(answer.userId);
        profileImageSrc = user.imageUrl;
    } catch (error: any) {
        // throw new Error(error.message)
    }

    return <Card>
        <CardHeader className={cn("flex items-center gap-2")}>
            {profileImageSrc && <Image className="rounded-full" width={30} height={30} src={profileImageSrc} alt={"Profile image"} />}
            <CardTitle>{answer.userFullName}</CardTitle>
        </CardHeader>
        <CardContent>
            {answer.answer}
        </CardContent>

        <CardFooter>
            <Upvote id={answer.id} upvoteCount={answer.upvoteCount} />
        </CardFooter>
    </Card>
}