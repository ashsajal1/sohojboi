import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await clerkClient().users.getUser(params.id);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
} 