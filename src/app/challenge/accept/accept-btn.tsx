"use client"

import { Button } from '@/components/ui/button'
import React from 'react'

export default function AcceptBtn({competitionId}:{competitionId: string}) {
    const handleAccept = async () => {
       

        // Redirect to the competition play page or reload
        window.location.href = `/challenge/result?competitionId=${competitionId}`;
    };
  return (
    <Button onClick={handleAccept}>Accept Challenge</Button>
  )
}
