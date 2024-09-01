"use client"

import { Button } from '@/components/ui/button'
import { BookOpenCheck } from 'lucide-react'
import { useTransition } from 'react'
import { markSolution } from './actions';

import LoaderIcon from '@/components/loader-icon';

export default function MarkSolution({ questionId, answerId }: { questionId: string, answerId: string }) {
    const [pending, startTransition] = useTransition();
    return (
        <Button
            disabled={pending}
            onClick={async () => {
                await startTransition(async () => {
                    await markSolution(questionId, answerId)
                })
            }} size='sm' variant={'outline'}>{pending ? <LoaderIcon /> : <BookOpenCheck className="mr-2 h-4 w-4" />}Mark as solution</Button>
    )
}
