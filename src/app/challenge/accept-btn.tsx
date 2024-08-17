"use client"

import LoaderIcon from '@/components/loader-icon'
import { Button } from '@/components/ui/button'
import { useTransition } from 'react'
import { Competition } from '@prisma/client';
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function AcceptBtn({ competition }: { competition: Competition }) {
    const [pending, startTransiton] = useTransition();
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const { replace } = useRouter();
    const handleDecline = async () => {
        const params = new URLSearchParams(searchParams);
        
        await startTransiton(async () => {
            await params.set('competitionId', competition.id);
            await replace(`${pathName}/accept?${params.toString()}`);
        });
    };

    return (
        <Button onClick={handleDecline} variant="outline" disabled={pending} className='w-full' size={'sm'}>
            {pending ? <><LoaderIcon />Accept Challenge</> : 'Accept Challenge'}
        </Button>
    )
}
