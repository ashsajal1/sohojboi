import { UserProfile } from '@clerk/nextjs'
import React from 'react'

export default function Account() {
  return (
    <div className='grid place-items-center p-6'>
        <UserProfile />
    </div>
  )
}
