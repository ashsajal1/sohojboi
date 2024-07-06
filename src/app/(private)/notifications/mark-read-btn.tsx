"use client"

import { Badge } from '@/components/ui/badge'
import React from 'react'
import { handleMarkRead } from './actions';

export default function MarkReadBtn({
    notificationId, status
}: {
    notificationId: string;
    status: boolean
}) {
    return (
        <>
            {(!status) &&
                < Badge onClick={() => handleMarkRead(notificationId)
                } className='cursor-pointer select-none' variant={'outline'} >
                    Mark as read
                </Badge >}
        </>
    )
}
