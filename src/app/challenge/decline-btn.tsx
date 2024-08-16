"use client"

import LoaderIcon from '@/components/loader-icon'
import { Button } from '@/components/ui/button'
import { useTransition } from 'react'
import { declineChallange } from './actions';
import { Competition } from '@prisma/client';

export default function DeclineBtn({ competiton }: { competiton: Competition }) {
    const [pending, startTransiton] = useTransition();
    const handleDecline = async () => {
        await startTransiton(async () => {
            await declineChallange(competiton)
        })
    }

    return (
        <Button onClick={handleDecline} variant="destructive" disabled={pending} className='w-full' size={'sm'}>
            {pending ? <><LoaderIcon />Declining</> : 'Decline Challange'}
        </Button>
    )
}
