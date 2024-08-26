'use client'

import { Button } from '@/components/ui/button'
import React from 'react'
import { handleUpvote } from "./actions";
import { Article } from "@prisma/client";
import { ChevronUp } from 'lucide-react'

export default function UpvoteArticle({ article, isUpvoted, upvoteCount }: {
    article: Article,
    isUpvoted: boolean,
    upvoteCount: number
}) {
    const [upvoteCounts, setUpvoteCounts] = React.useState(upvoteCount);
    const [upvoted, setUpvoted] = React.useState(isUpvoted);

    return (
        <Button size={'sm'} onClick={async () => {
            // if (optimisticUpvotes.upvoting) return;
            if (upvoted) {
                setUpvoted(false);
                setUpvoteCounts(upvoteCounts - 1); // Optimistically update the count
                await handleUpvote(article);
                return;
            } else {
                setUpvoted(true);
                setUpvoteCounts(upvoteCount + 1); // Optimistically update the count
                await handleUpvote(article);
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

