import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import prisma from '@/lib/prisma'
import { clerkClient } from '@clerk/nextjs/server'
import { Coins } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

export default async function TopUsersPage() {
    const users = await prisma.profile.findMany({
        orderBy: {
            rewardCount: 'desc'
        },
        take: 10,
    });

    const clerkUsers = await clerkClient().users.getUserList();
    // Combine the two datasets
    const userList = users.map(user => {
        const clerkUser = clerkUsers.data.find(clerkUser => clerkUser.id === user.clerkUserId);
        return {
            id: user.clerkUserId,
            fullName: clerkUser ? `${clerkUser.firstName} ${clerkUser.lastName}` : null,
            imgUrl: clerkUser ? clerkUser.imageUrl : null,
            rewardCount: user.rewardCount, // Include additional properties from the profile
        };
    }).filter(user => user.fullName !== null); // Filter out users without a matching Clerk user

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {userList.map((user, index) => (
                <Card key={user.id}>
                    <CardHeader>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center justify-between gap-2'>
                                <span>#{index + 1}</span>
                                <Image src={user.imgUrl!} alt="Profile image" width={30} height={30} className="rounded-full" />
                                <p>{user.fullName}</p>
                            </div>
                            <div>
                                <Button variant={'ghost'}>
                                    <Coins className='h-4 w-4 mr-2 text-yellow-600' />
                                    {user.rewardCount}
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                </Card>
            ))}
        </div>
    )
}
