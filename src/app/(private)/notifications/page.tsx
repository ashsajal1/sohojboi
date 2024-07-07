import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import React from 'react'
import { Notification, NotificationType } from "@prisma/client"
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/date-format';
import MarkReadBtn from './mark-read-btn';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default async function page() {
    const userId = auth().userId;
    let notifications: null | Notification[] = null;
    if (userId) {
        try {
            notifications = await prisma.notification.findMany({
                where: {
                    userId: userId as string
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
        } catch (error) {
            notifications = null
        }
    }

    // console.log(notifications)

    const oldNotificatons = notifications?.filter(n => n.read === true)
    const newNotificatons = notifications?.filter(n => n.read === false)
    return (
        <div className='flex flex-col gap-2'>
            {(newNotificatons !== null && newNotificatons?.length !== 0) && <h3>Unread notifications</h3>}
            {newNotificatons?.map(notification => (
                <Card key={notification.id}>
                    <CardHeader>
                        <CardTitle>{notification.message}</CardTitle>
                        <div className='flex items-center gap-2'>
                            <p className='text-sm text-muted-foreground'>{formatDate(notification.createdAt)}</p>
                            <MarkReadBtn status={notification.read} notificationId={notification.id} />

                            <Link href={`${getPathnameByNotificationType(notification.type)}`}>
                                <Badge variant={'outline'}>
                                    View {getPathnameByNotificationType(notification.type)?.split('/')[1]}
                                </Badge>
                            </Link>
                        </div>
                    </CardHeader>
                </Card>
            ))}
            {(oldNotificatons !== null && oldNotificatons?.length !== 0) && <h3 className='mt-3'>Old notifications</h3>}

            {oldNotificatons?.map(notification => (
                <Card className='text-muted-foreground' key={notification.id}>
                    <CardHeader>
                        <CardTitle>{notification.message}</CardTitle>
                        <div className='flex items-center gap-2'>
                            <p className='text-sm text-muted-foreground'>{formatDate(notification.createdAt)}</p>
                            <MarkReadBtn status={notification.read} notificationId={notification.id} />

                            <Link href={`/`}>
                                <Badge variant={'outline'}>
                                    View {notification.type}
                                </Badge>
                            </Link>
                        </div>
                    </CardHeader>
                </Card>
            ))}

            {notifications?.length === 0 && <h1 className='font-bold text-2xl text-muted-foreground text-center p-4'>Notification is empty!</h1>}
        </div>
    )
}

const getPathnameByNotificationType = (type: string) => {
    switch (type) {
        case NotificationType.ANSWER:
            return '/question'
        case NotificationType.CHALLENGE:
            return '/challenge'
    }
}