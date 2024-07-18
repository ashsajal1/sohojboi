'use client'

import { Button } from "@/components/ui/button";
import { handleUpvote } from "./actions";
import { useOptimistic, useTransition } from "react";
import { Article } from "@prisma/client";
import { getStatusText } from "@/lib/utils";

interface AnswersParams {
    article: Article;
    isUpvotedAnswer: boolean;
    upvoteCount: number
}

export default function UpvoteArticle({ article, isUpvotedAnswer, upvoteCount }: AnswersParams) {

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
                await handleUpvote(article)
            })
        }} variant="outline">{upvoteCount} {optimisticUpvotes.upvoting ? 'Progressing' : [statusText]}</Button>
    )
}