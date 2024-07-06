"use client"

import { Badge } from '@/components/ui/badge'
import React from 'react'
import { handleMarkRead } from './actions';

export default function MarkReadBtn({
    notificationId,
}: {
  notificationId: string;
}) {
    return (
        <Badge onClick={() => handleMarkRead(notificationId)} className='cursor-pointer select-none' variant={'outline'}>Mark as read</Badge>
    )
}
