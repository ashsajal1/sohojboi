import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react'

export default async function page() {
    const competitions = await prisma.competition.findMany()

    // console.log(competitions)
    return (
        <div>
            {competitions.map(competition => (
                <Card key={competition.id}>
                    <CardHeader>
                        <CardTitle>
                            Competition Results: {competition.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p><strong>Challenger Score:</strong> {competition.challengerScore}</p>
                        <p><strong>Challengee Score:</strong> {competition.challengeeScore}</p>
                        <p><strong>Status:</strong> {competition.status}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
