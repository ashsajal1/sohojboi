'use client'

import { Button } from "@/components/ui/button";
import { handleCommentUpvote } from "./actions";
import { useOptimistic, useTransition } from "react";
import { Comment } from "@prisma/client";
import { getStatusText } from "@/lib/utils";

interface AnswersParams {
    comment: Comment;
    isUpvoted: boolean;
    upvoteCount: number
}

export default function UpvoteComment({ comment, isUpvoted, upvoteCount }: AnswersParams) {

    const [optimisticUpvotes, addOptimisticUpvote] = useOptimistic(
        { upvoteCount, upvoting: false },
        (state, newUpvoteCount: number) => ({
            ...state,
            upvoteCount: newUpvoteCount,
            upvoting: true
        })
    )

    const statusText = getStatusText(isUpvoted)

    let [_, startTransition] = useTransition();
    return (
        <Button size={'sm'} onClick={async () => {
            startTransition(async () => {
                addOptimisticUpvote(optimisticUpvotes.upvoteCount + 1);
                await handleCommentUpvote(comment)
            })
        }} variant={isUpvoted? 'secondary':'outline'}>{upvoteCount} {optimisticUpvotes.upvoting ? 'Progressing' : [statusText]}</Button>
    )
}