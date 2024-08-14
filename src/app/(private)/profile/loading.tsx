import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function loading() {
  return (
    <div className='grid gap-2'>
      <div className='flex flex-col w-full gap-2'>
        <Skeleton className='w-full h-[250px]' />
        <Skeleton className='w-full h-[50px]' />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
        <Skeleton className='w-full h-[200px]' />
        <Skeleton className='w-full h-[200px]' />
        <Skeleton className='w-full h-[200px]' />
        <Skeleton className='w-full h-[200px]' />
        <Skeleton className='w-full h-[200px]' />
        <Skeleton className='w-full h-[200px]' />
        <Skeleton className='w-full h-[200px]' />
        <Skeleton className='w-full h-[200px]' />
      </div>
    </div>
  )
}
