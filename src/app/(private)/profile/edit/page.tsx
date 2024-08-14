import React from 'react'
import EditForm, { UserDataProps } from './edit-form'
import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export default async function page() {
  let userData: UserDataProps;
  const thisUser = await currentUser();
  const dbUser = await prisma.profile.findUnique({
    where: {
      clerkUserId: thisUser?.id
    }
  })

  userData = {
    name: thisUser?.fullName!,
    bio: dbUser?.bio || '',
    address: dbUser?.address!,
    grade: dbUser?.grade!,
    id: thisUser?.id!
  }

  return (
    <div>
      <EditForm userData={userData} />
    </div>
  )
}
