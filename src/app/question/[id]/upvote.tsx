'use client'

import { Button } from "@/components/ui/button";
import { handleUpvote } from "./action";
import { useOptimistic, useTransition } from "react";

interface AnswersParams {
    id: string;
    upvoteCount: number;
}

export default function Upvote({ id, upvoteCount }: AnswersParams) {
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
                await handleUpvote(id, upvoteCount)
            })

        }} variant="outline">{upvoteCount} {optimisticUpvotes.upvoting ? 'Upvoting' : 'Upvote'}</Button>
    )
}
