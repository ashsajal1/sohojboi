"use client"

import { Button } from '@/components/ui/button'
import React, { useOptimistic, useTransition } from 'react'
import { handleQuestionUpvote } from './actions'

export default function UpvoteBtn({ id, upvoteCount }: { id: string, upvoteCount: number }) {
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
                await handleQuestionUpvote(id, upvoteCount)
            })
        }} variant={'outline'}>{upvoteCount} {optimisticUpvotes.upvoting ? 'Upvoting' : 'Upvote'}</Button>
    )
}
