import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function loading() {
    return (
        <div className='flex flex-col gap-2'>
            <Skeleton className='w-full h-[100px]' />
            <Skeleton className='w-full h-[100px]' />
            <Skeleton className='w-full h-[100px]' />
            <Skeleton className='w-full h-[100px]' />
            <Skeleton className='w-full h-[100px]' />
            <Skeleton className='w-full h-[100px]' />
            <Skeleton className='w-full h-[100px]' />
        </div>
    )
}
