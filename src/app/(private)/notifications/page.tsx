import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import React from 'react'
import { Notification } from "@prisma/client"
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/date-format';
import MarkReadBtn from './mark-read-btn';

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
    return (
        <div className='flex flex-col gap-2'>
            {notifications?.map(notification => (
                <Card key={notification.id}>
                    <CardHeader>
                        <CardTitle>{notification.message}</CardTitle>
                        <div className='flex items-center gap-2'>
                            <p className='text-sm text-muted-foreground'>{formatDate(notification.createdAt)}</p>
                            <MarkReadBtn status={notification.read} notificationId={notification.id} />
                        </div>
                    </CardHeader>
                </Card>
            ))}
        </div>
    )
}