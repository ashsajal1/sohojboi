"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Comment from "./comment"
import { useState } from "react"
import CommentForm from "./comment-form"
import { Answer, AnswerComment } from "@prisma/client"

export default function CommentSection({ answer }: { answer: Answer }) {
    const [open, setOpen] = useState(false)
    return (
        <div className="w-full">
            <Separator className="mt-2 w-full" />

            {answer.comments.length === 0 ? <p
            >No comments yet</p> : <div>
                {answer.comments.map((comment: AnswerComment) => (
                    <Comment key={comment.id} comment={comment} />
                ))}
            </div>}

            {
                open && <CommentForm answerId={answer.id} />
            }
            {
                !open && <Button className="p-0" variant="link" onClick={() => setOpen(!open)}>Add comment</Button>
            }
        </div>
    )
}
