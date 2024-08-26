"use client"

import { Button } from '@/components/ui/button'
import React, { useOptimistic } from 'react'
import { handleQuestionUpvote } from './actions'
import { Question } from '@prisma/client'
import { ChevronUp } from 'lucide-react'

export default function UpvoteBtn({ question, actorId, isUpvotedQuestion }: {
    question: Question,
    actorId: string,
    isUpvotedQuestion: boolean
}) {
    const [upvoteCount, setUpvoteCount] = React.useState(question.upvoteCount);
    const [isUpvoted, setIsUpvoted] = React.useState(isUpvotedQuestion);
    const currentUpvoteCount = question.upvoteCount;
    const [optimisticUpvotes, addOptimisticUpvote] = useOptimistic(
        { currentUpvoteCount, upvoting: false },
        (state, newUpvoteCount: number) => ({
            ...state,
            upvoteCount: newUpvoteCount,
            upvoting: true
        })
    );

    return (
        <Button size={'sm'} onClick={async () => {
            if (optimisticUpvotes.upvoting) return;
            if (isUpvoted) {
                setIsUpvoted(false);
                setUpvoteCount(upvoteCount - 1); // Optimistically update the count
                await handleQuestionUpvote(question, actorId);
                return;
            } else {
                setIsUpvoted(true);
                setUpvoteCount(upvoteCount + 1); // Optimistically update the count
                await handleQuestionUpvote(question, actorId);
                return;
            }
        }} 
        className={`transition-colors duration-300 ${isUpvoted ? 'text-green-600' : ''}`}
        variant={'ghost'}
        >
            <ChevronUp className='w-4 h-4 mr-2' />
            {upvoteCount}
        </Button>
    )
}
