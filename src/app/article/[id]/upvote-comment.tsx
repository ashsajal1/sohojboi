'use client'

import { Button } from '@/components/ui/button'
import React from 'react'
import { handleCommentUpvote } from "./actions";
import { ChevronUp } from 'lucide-react'
import { Comment } from '@prisma/client'

interface AnswersParams {
    comment: Comment;
    isUpvoted: boolean;
    upvoteCount: number
}

export default function UpvoteComment({ comment, isUpvoted, upvoteCount }: AnswersParams) {

    const [upvoteCounts, setUpvoteCounts] = React.useState(upvoteCount);
    const [upvoted, setUpvoted] = React.useState(isUpvoted);

    return (
        <Button size={'sm'} onClick={async () => {
            // if (optimisticUpvotes.upvoting) return;
            if (upvoted) {
                setUpvoted(false);
                setUpvoteCounts(upvoteCounts - 1); // Optimistically update the count
                await handleCommentUpvote(comment);
                return;
            } else {
                setUpvoted(true);
                setUpvoteCounts(upvoteCount + 1); // Optimistically update the count
                await handleCommentUpvote(comment);
                return;
            }
        }}
            className={`transition-colors duration-300 ${upvoted ? 'text-green-600' : ''}`}
            variant={'ghost'}
        >
            <ChevronUp className='w-4 h-4 mr-2' />
            {upvoteCounts}
        </Button>
    )
}