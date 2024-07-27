import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function loading() {
  return (
    <div className='grid grid-cols-1 gap-2'>
        <Skeleton className='w-[50px] h-[30px]' />
        <Skeleton className='w-full h-[100px]' />
        <Skeleton className='w-full h-[100px]' />
        <Skeleton className='w-full h-[100px]' />

        <Skeleton className='w-[50px] mt-4 h-[30px]' />
        <Skeleton className='w-full h-[100px]' />
        <Skeleton className='w-full h-[100px]' />
        <Skeleton className='w-full h-[100px]' />
    </div>
  )
}
