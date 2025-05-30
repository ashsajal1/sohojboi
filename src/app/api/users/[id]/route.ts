import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const user = await clerkClient().users.getUser(params.id);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
} 