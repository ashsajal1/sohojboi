import { type Comment } from '@prisma/client';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { clerkClient } from '@clerk/nextjs/server';
import ProfileImgCard from '@/components/profile-img-card';
import { Button } from '@/components/ui/button';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import CommentForm from './comment-form';

interface CommentProps {
    comment: Comment;
    replies?: Comment[];
    depth?: number; // Added depth prop
}

export default async function Comment({ comment, replies, depth }: CommentProps) {
    const user = await clerkClient().users.getUser(comment.authorId);
    console.log(replies)
    return (
        <Card className={`mt-2 ${depth! > 0 ? 'ml-4':''}`} key={comment.id}>
            <CardHeader>
                <CardDescription>{comment.content}</CardDescription>
                <ProfileImgCard
                    type={'comment'}
                    userId={user.id}
                    createdAt={comment.createdAt}
                />
                <div>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>
                                <Button>Reply</Button>
                            </AccordionTrigger>
                            <AccordionContent>
                                <CommentForm articleId={comment.articleId} parentId={comment.id} />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                </div>
            </CardHeader>
            {replies && (
                replies?.map(reply => (
                    <Comment key={reply.id} comment={reply} depth={depth + 1} />
                ))
            )}
        </Card>
    );
}
