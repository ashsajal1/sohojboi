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
    // let [isPending, startTransition] = useTransition();
    return (
        // <Button onClick={() => startTransition(() => handleUpvote(id, upvoteCount))} variant="outline">{upvoteCount} {isPending ? 'Upvoting' : 'Upvote'}</Button>
        <Button onClick={async () => {
            addOptimisticUpvote(optimisticUpvotes.upvoteCount + 1);
            await handleUpvote(id, upvoteCount)

        }} variant="outline">{upvoteCount} {optimisticUpvotes.upvoting ? 'Upvoting' : 'Upvote'}</Button>
    )
}
