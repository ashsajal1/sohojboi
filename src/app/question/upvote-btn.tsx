"use client"

import { Button } from '@/components/ui/button'
import React, { useOptimistic, useTransition } from 'react'
import { handleQuestionUpvote } from './actions'
import { Question } from '@prisma/client'

export default function UpvoteBtn({ question, actorId }: {
    question: Question,
    actorId: string
}) {
    const currentUpvoteCount = question.upvoteCount;
    const [optimisticUpvotes, addOptimisticUpvote] = useOptimistic(
        { currentUpvoteCount, upvoting: false },
        (state, newUpvoteCount: number) => ({
            ...state,
            upvoteCount: newUpvoteCount,
            upvoting: true
        })
    );
    let [_, startTransition] = useTransition();

    return (
        <Button onClick={async () => {
            startTransition(async () => {
                addOptimisticUpvote(optimisticUpvotes.currentUpvoteCount + 1);
                await handleQuestionUpvote(question, currentUpvoteCount, actorId)
            })
        }} variant={'outline'}>{currentUpvoteCount} {optimisticUpvotes.upvoting ? 'Upvoting' : 'Upvote'}</Button>
    )
}
