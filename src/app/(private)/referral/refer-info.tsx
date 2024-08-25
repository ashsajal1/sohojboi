"use client"
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
                <Button variant={'outline'}>Share</Button>
            </CardFooter>
        </Card>
    )
}
