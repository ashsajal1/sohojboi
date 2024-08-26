"use client"

import { Button } from '@/components/ui/button'
import React from 'react'
import { handleUpvote } from './actions'
import { Answer, Question } from '@prisma/client'
import { ChevronUp } from 'lucide-react'

interface AnswersParams {
    answer: Answer;
    userId: string;
    question: Question | null;
    isUpvotedAnswer: boolean
}

export default function Upvote({ answer, userId, question, isUpvotedAnswer }: AnswersParams) {
    const [upvoteCount, setUpvoteCount] = React.useState(answer.upvoteCount);
    const [isUpvoted, setIsUpvoted] = React.useState(isUpvotedAnswer);

    return (
        <Button size={'sm'} onClick={async () => {
            // if (optimisticUpvotes.upvoting) return;
            if (isUpvoted) {
                setIsUpvoted(false);
                setUpvoteCount(upvoteCount - 1); // Optimistically update the count
                await handleUpvote(answer, userId, question);
                return;
            } else {
                setIsUpvoted(true);
                setUpvoteCount(upvoteCount + 1); // Optimistically update the count
                await handleUpvote(answer, userId, question);
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