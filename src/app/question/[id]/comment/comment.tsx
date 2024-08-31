"use client"

import { Separator } from '@/components/ui/separator'
import EditComment from './edit-comment'
import DeleteComment from './delete-comment'
import { AnswerComment } from '@prisma/client'
import { useEffect, useState } from 'react'
import { getName } from './actions'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { formatDate } from '@/lib/date-format'

export default function Comment({ comment }: { comment: AnswerComment }) {
    const [name, setName] = useState<any>('');
    const user = useUser()

    useEffect(() => {
        const fetchName = async () => {
            const fullName = await getName(comment.userId);
            setName(fullName);
        };

        fetchName();
    }, [comment.userId]);

    return (
        <div className="text-sm text-muted-foreground/60 py-3">
            <div className="flex items-center gap-2">
                <p className='text-muted-foreground'>{comment.content}</p>
                -
                <p>{formatDate(comment.createdAt)}</p>
                <p className="font-semibold">- <Link href={`/profile?id=${comment.userId}`}>
                    {name}</Link></p>
                {user.user?.id === comment.userId && <>
                    <EditComment />
                    <DeleteComment />
                </>}
            </div>
            <Separator className="mt-2 w-full" />
        </div>
    )
}