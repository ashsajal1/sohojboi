"use client"

import { Button } from "@/components/ui/button"
import { useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Competition } from "@prisma/client";
import LoaderIcon from "@/components/loader-icon";

export default function AcceptBtn({ competition }: { competition: Competition }) {
    const [pending, startTransiton] = useTransition();
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const { replace } = useRouter();
    const handleAccept = async () => {
        const params = new URLSearchParams(searchParams);

        await startTransiton(async () => {
            await params.set('competitionId', competition.id);
            await replace(`accept?${params.toString()}`);
        });
    };

    return (
        <Button onClick={handleAccept} disabled={pending} variant={'destructive'}>
            {pending? <><LoaderIcon />Accept</> : `Accept`}
        </Button>
    )
}
