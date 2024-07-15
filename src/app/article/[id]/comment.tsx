import { type Comment } from '@prisma/client';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { clerkClient } from '@clerk/nextjs/server';
import ProfileImgCard from '@/components/profile-img-card';

interface CommentProps {
    comment: Comment;
}

export default async function Comment({ comment }: CommentProps) {
    const user = await clerkClient().users.getUser(comment.authorId);

    return (
        <Card className='mt-2' key={comment.id}>
            <CardHeader>
                <CardDescription>{comment.content}</CardDescription>
                <ProfileImgCard
                    type={'comment'}
                    userId={user.id}
                    createdAt={comment.createdAt}
                />
            </CardHeader>
        </Card>
    );
}
