"use client"

import { Button } from "@/components/ui/button"
import { useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Competition } from "@prisma/client";
import LoaderIcon from "@/components/loader-icon";

export default function AcceptBtn({ competition }: { competition: Competition }) {
    const [pending, startTransition] = useTransition();
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const { replace } = useRouter();
    const handleAccept = async () => {
        const params = new URLSearchParams(searchParams);

        startTransition(() => {
            params.set('competitionId', competition.id);
            replace(`/challenge/play?${params.toString()}`);
        });
    };

    return (
        <Button onClick={handleAccept} disabled={pending} variant={'destructive'}>
            {pending? <><LoaderIcon />Accept</> : `Accept`}
        </Button>
    )
}
