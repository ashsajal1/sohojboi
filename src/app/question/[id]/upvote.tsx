'use client'

import { Button } from "@/components/ui/button";
import { handleUpvote } from "./actions";
import { useOptimistic, useTransition } from "react";
import { Answer, Question } from "@prisma/client";
import { getStatusText } from "@/lib/utils";

interface AnswersParams {
    answer: Answer;
    userId: string;
    question: Question | null;
    isUpvotedAnswer: boolean
}

export default function Upvote({ answer, userId, question, isUpvotedAnswer }: AnswersParams) {
    const upvoteCount = answer.upvoteCount;
    const [optimisticUpvotes, addOptimisticUpvote] = useOptimistic(
        { upvoteCount, upvoting: false },
        (state, newUpvoteCount: number) => ({
            ...state,
            upvoteCount: newUpvoteCount,
            upvoting: true
        })

    )

    const statusText = getStatusText(isUpvotedAnswer)

    let [_, startTransition] = useTransition();
    return (
        <Button size={'sm'} onClick={async () => {
            startTransition(async () => {
                addOptimisticUpvote(optimisticUpvotes.upvoteCount + 1);
                await handleUpvote(answer, userId, question)
            })
        }} variant={isUpvotedAnswer? 'secondary':'outline'}>{upvoteCount} {optimisticUpvotes.upvoting ? 'Progressing' : [statusText]}</Button>
    )
}