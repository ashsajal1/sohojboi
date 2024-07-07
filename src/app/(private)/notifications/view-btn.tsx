"use client"
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import React from 'react'
import { Notification, NotificationType } from '@prisma/client';
import { handleMarkRead } from './actions';

const getPathnameByNotificationType = (notification: Notification | null): string | undefined => {
    switch (notification?.type) {
        case NotificationType.ANSWER:
            return `/question/${notification.questionId}`
        case NotificationType.CHALLENGE:
            return `/challenge/result?competitionId=${notification.competitionId}`
        default:
            return undefined
    }
}

export default function ViewBtn({ notification }: { notification: Notification | null }) {
    return (
        <Link onClick={() => handleMarkRead(notification?.id || '')} href={`${getPathnameByNotificationType(notification)}`}>
            <Badge variant={'outline'}>
                View {getPathnameByNotificationType(notification)?.split('/')[1]}
            </Badge>
        </Link>
    )
}
