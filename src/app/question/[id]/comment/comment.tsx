"use client"

import { Separator } from '@/components/ui/separator'
import EditComment from './edit-comment'
import DeleteComment from './delete-comment'
export default function Comment() {
    
    return (
        <div className="text-sm text-muted-foreground/60 py-3">
            <div className="flex items-center gap-2">
                <p>This is my comment</p>
                <p className="font-semibold">- Ashfiquzzaman Sajal</p>
                <EditComment />
                <DeleteComment />
            </div>
            <Separator className="mt-2 w-full" />
        </div>
    )
}
