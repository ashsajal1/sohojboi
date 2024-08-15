import { type Comment as PrismaComment } from '@prisma/client';
import React from 'react';
import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import { clerkClient, currentUser } from '@clerk/nextjs/server';
import ProfileImgCard from '@/components/profile-img-card';
import { Button } from '@/components/ui/button';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import CommentForm from './comment-form';
import prisma from '@/lib/prisma';
import Content from '../../../components/content';
import ReactMarkdown from 'react-markdown';
import CommentDropDown from './comment-drop-down';
import { checkRole } from '@/lib/roles';
import UpvoteComment from './upvote-comment';

interface CommentProps {
    comment: PrismaComment;
};

export default async function Comment({ comment }: CommentProps) {
    const cUser = await currentUser();
    const user = await clerkClient().users.getUser(comment.authorId);
    let isUpvoted;
    const commentReplies = await prisma.comment.findMany({
        where: {
            parentId: comment.id
        },
    });
    

    if (cUser?.id) {
        isUpvoted = await prisma.upvote.findUnique({
            where: {
                userId_commentId: {
                    userId: cUser?.id!,
                    commentId: comment.id
                }
            }
        })
    }

    const hasPermission = cUser?.id === comment.authorId || checkRole("admin")

    const upvoteCount = await prisma.upvote.aggregate({
        _count: {
            userId: true
        },
        where: {
            commentId: {
                in: [comment?.id!]
            }
        }
    });

    return (
        <Card className={`mt-2`} key={comment.id}>
            <CardHeader>
                <CardDescription>
                    <div className='flex items-center justify-between'>
                        <ReactMarkdown>{comment.content}</ReactMarkdown>
                        <CommentDropDown hasPermission={hasPermission} commentText={comment.content} commentId={comment.id} />
                    </div>
                </CardDescription>
                <div className='flex items-center justify-between'>
                    <ProfileImgCard
                        type={'comment'}
                        userId={user.id}
                        createdAt={comment.createdAt}
                    />

                    <UpvoteComment comment={comment!} isUpvoted={!!isUpvoted} upvoteCount={upvoteCount._count.userId} />
                </div>
                <div>
                    {cUser?.id && <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>
                                <Button>Reply</Button>
                            </AccordionTrigger>
                            <AccordionContent>
                                <CommentForm articleId={comment.articleId} parentId={comment.id} />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>}
                </div>
            </CardHeader>
            {commentReplies && (
                commentReplies?.map(reply => (
                    <Reply key={reply.id} reply={reply} userId={reply.authorId} parentId={comment.id} />
                ))
            )}
        </Card>
    );
}


const Reply = ({ reply, userId, parentId }: { reply: PrismaComment, userId: string, parentId: string }) => {
    return <Card className={`ml-4 mt-2`} key={reply.id}>
        <CardHeader>
            <CardDescription>
                <Content content={reply.content} />
            </CardDescription>
            <ProfileImgCard
                type={'comment'}
                userId={userId}
                createdAt={reply.createdAt}
            />
            <div>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>
                            <Button>Reply</Button>
                        </AccordionTrigger>
                        <AccordionContent>
                            <CommentForm articleId={reply.articleId} parentId={parentId} />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

            </div>
        </CardHeader>

    </Card>
}