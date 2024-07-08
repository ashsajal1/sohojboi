'use client'

import { Button } from "@/components/ui/button";
import { handleUpvote } from "./actions";
import { useOptimistic, useTransition } from "react";
import { Answer, Question } from "@prisma/client";

interface AnswersParams {
    answer: Answer;
    userId: string;
    question: Question | null
}

export default function Upvote({ answer, userId, question }: AnswersParams) {
    const upvoteCount = answer.upvoteCount;
    const [optimisticUpvotes, addOptimisticUpvote] = useOptimistic(
        { upvoteCount, upvoting: false },
        (state, newUpvoteCount: number) => ({
            ...state,
            upvoteCount: newUpvoteCount,
            upvoting: true
        })

    )
    let [_, startTransition] = useTransition();
    return (
        <Button onClick={async () => {
            startTransition(async () => {
                addOptimisticUpvote(optimisticUpvotes.upvoteCount + 1);
                await handleUpvote(answer, userId, question)
            })
        }} variant="outline">{upvoteCount} {optimisticUpvotes.upvoting ? 'Upvoting' : 'Upvote'}</Button>
    )
}
