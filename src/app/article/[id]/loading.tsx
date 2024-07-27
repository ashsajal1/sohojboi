import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function loading() {
  return (
    <div>
    <Skeleton className='w-full h-screen rounded' />
    </div>
  )
}
