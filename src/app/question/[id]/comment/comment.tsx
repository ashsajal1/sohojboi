"use client"

import { Separator } from '@/components/ui/separator'
import EditComment from './edit-comment'
import DeleteComment from './delete-comment'
import { AnswerComment } from '@prisma/client'
export default function Comment({comment}:{comment: AnswerComment}) {
    
    return (
        <div className="text-sm text-muted-foreground/60 py-3">
            <div className="flex items-center gap-2">
                <p>{comment.content}</p>
                <p className="font-semibold">- Ashfiquzzaman Sajal</p>
                <EditComment />
                <DeleteComment />
            </div>
            <Separator className="mt-2 w-full" />
        </div>
    )
}
