"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Comment from "./comment"
import { useState } from "react"
import CommentForm from "./comment-form"

export default function CommentSection() {
    const [open, setOpen] = useState(false)
    return (
        <div className="w-full">
            <Separator className="mt-2 w-full" />
           
            <Comment />
            {
                open && <CommentForm />
            }
            {
                !open &&   <Button className="p-0" variant="link" onClick={() => setOpen(!open)}>Add comment</Button>
            }
        </div>
    )
}