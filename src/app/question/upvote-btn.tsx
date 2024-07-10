"use client"

import { Button } from '@/components/ui/button'
import React, { useOptimistic, useTransition } from 'react'
import { handleQuestionUpvote } from './actions'
import { Question } from '@prisma/client'
import { getStatusText } from '@/lib/utils'
import { TriangleUpIcon } from '@radix-ui/react-icons'

export default function UpvoteBtn({ question, actorId, isUpvotedQuestion }: {
    question: Question,
    actorId: string,
    isUpvotedQuestion: boolean
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

    const statusText = getStatusText(isUpvotedQuestion)

    return (
        <Button size={'sm'} onClick={async () => {
            startTransition(async () => {
                addOptimisticUpvote(optimisticUpvotes.currentUpvoteCount + 1);
                await handleQuestionUpvote(question, actorId)
            })
        }} variant={isUpvotedQuestion? 'secondary':'outline'}>
            <TriangleUpIcon className='mr-1' /> {optimisticUpvotes.upvoting ? 'Progressing' : [statusText]}</Button>
    )
}
