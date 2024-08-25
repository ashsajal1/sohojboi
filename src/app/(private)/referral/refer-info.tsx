"use client"
import ShareBtn from '@/components/share-btn'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { User } from '@clerk/nextjs/server'
import { Refer } from '@prisma/client'
import React from 'react'

export default function ReferInfo({ user, refer }: { user: User, refer: Refer[] }) {
    return (
        <Card className="mt-3">
            <CardHeader>
                <p>Your referal code: <code>{user?.id}</code></p>
            </CardHeader>
            <CardContent>
                <p>Your referal count: <code>{refer.length}</code></p>
            </CardContent>
            <CardFooter>
                <ShareBtn title={`Use my refer code: ${user?.id} and get 100 points bonus.`} description={`Use my refer code: ${user?.id} and get 100 points bonus.`} />
            </CardFooter>
        </Card>
    )
}
