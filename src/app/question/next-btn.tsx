"use client"

import LoaderIcon from '@/components/loader-icon'
import { Button } from '@/components/ui/button'
import { useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight } from 'lucide-react';

export default function NextBtn({ page }: { page: number }) {
    const [pending, startTransiton] = useTransition();
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const { replace } = useRouter();
    const handleDecline = async () => {
        const params = new URLSearchParams(searchParams);

        await startTransiton(async () => {
            await params.set('page', page.toString());
            await replace(`${pathName}?${params.toString()}`);
        });
    };

    return (
        <Button onClick={handleDecline} variant="outline" disabled={pending} className='w-full md:w-auto'>
            {pending ? <><LoaderIcon />Next Page</> : <>Next Page
                <ArrowRight className='h-4 w-4 ml-2' /></>}
        </Button>
    )
}
