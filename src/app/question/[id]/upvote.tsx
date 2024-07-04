'use client'

import { Button } from "@/components/ui/button";
import { handleUpvote } from "./action";

interface AnswersParams {
    id: string;
    upvoteCount: number;
}

export default function Upvote({ id, upvoteCount }: AnswersParams) {
    return (
        <Button onClick={() => handleUpvote(id, upvoteCount)} variant="outline">{upvoteCount} Upvote</Button>
    )
}
