import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react'
import { clerkClient } from '@clerk/nextjs/server';

export default async function page() {
    const competitions = await prisma.competition.findMany()

   

    // console.log(competitions)
    return (
        <div>
            {competitions.map(competition => (
                <StatusCard key={competition.id} competition={competition} />
            ))}
        </div>
    )
}

interface CompetitonProps {
    id: string;
    title: string;
    description: string | null;
    quizId: string;
    challengerId: string;
    challengeeId: string;
    challengerScore: number;
    challengeeScore: number | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
const StatusCard = async ({ competition }: { competition: CompetitonProps }) => {
    const challangerName = await (await clerkClient().users.getUser(competition.challengerId)).fullName;
    const challangeeName = await (await clerkClient().users.getUser(competition.challengeeId)).fullName;
    

    return <Card key={competition.id}>
        <CardHeader>
            <CardTitle>
                Competition Results: {challangerName} vs {challangeeName}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p><strong>Challenger Score:</strong> {competition.challengerScore}</p>
            <p><strong>Challengee Score:</strong> {competition.challengeeScore}</p>
            <p><strong>Status:</strong> {competition.status}</p>
        </CardContent>
    </Card>
}