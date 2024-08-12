"use client"

import { Badge } from '@/components/ui/badge'
import React, { useTransition } from 'react'
import { handleMarkRead } from './actions';
import { LoaderCircle } from 'lucide-react';

export default function MarkReadBtn({
    notificationId, status
}: {
    notificationId: string;
    status: boolean
}) {

    const [pending, startTransition] = useTransition();
    return (
        <>
            {(!status) &&
                <Badge
                    onClick={async () => {
                        await startTransition(async () => {
                            await handleMarkRead(notificationId)
                        })
                    }
                    }
                    className='cursor-pointer select-none' variant={'outline'} >
                    {pending &&
                        <LoaderCircle className="mr-2 h-2 w-2 animate-spin" />}
                    Mark as read
                </Badge >}
        </>
    )
}
