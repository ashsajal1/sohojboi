"use client"
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import React from 'react'
import { getPathnameByNotificationType } from './page';
import { Notification } from '@prisma/client';
import { handleMarkRead } from './actions';

export default function ViewBtn({ notification }: { notification: Notification }) {
    return (
        <Link onClick={() => handleMarkRead(notification.id)} href={`${getPathnameByNotificationType(notification)}`}>
            <Badge variant={'outline'}>
                View {getPathnameByNotificationType(notification)?.split('/')[1]}
            </Badge>
        </Link>
    )
}
