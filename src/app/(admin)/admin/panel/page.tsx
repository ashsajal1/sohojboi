import { checkRole } from '@/lib/roles'
import React from 'react'

export default async function page() {
  const isAdmin = await checkRole("admin");
  if (!isAdmin) {
    throw new Error("Unauthorized access!")
  }
  return (
    <div className="container mx-auto">
      <h1 className='font-bold text-lg'>Users and Challenge questions table</h1>
    </div>
  )
}
