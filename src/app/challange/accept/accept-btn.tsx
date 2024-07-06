"use client"

import { Button } from '@/components/ui/button'
import React from 'react'

export default function AcceptBtn({competitionId}:{competitionId: string}) {
    const handleAccept = async () => {
        // await prisma.competition.update({
        //     where: { id: competitionId },
        //     data: { status: "accepted" }
        // });

        // Redirect to the competition play page or reload
        window.location.href = `/challange/result?competitionId=${competitionId}`;
    };
  return (
    <Button onClick={handleAccept}>Accept Challenge</Button>
  )
}
