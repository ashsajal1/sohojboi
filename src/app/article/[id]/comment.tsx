import { type Comment as PrismaComment } from '@prisma/client';
import React from 'react';
import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import { clerkClient, currentUser, User } from '@clerk/nextjs/server';
import ProfileImgCard from '@/components/profile-img-card';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import CommentForm from './comment-form';
import prisma from '@/lib/prisma';
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
            parentId: comment.id,
            deletedAt: null
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
                                Reply
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
                    <Reply key={reply.id} cUser={cUser!} reply={reply} userId={reply.authorId} parentId={comment.id} />
                ))
            )}
        </Card>
    );
}


const Reply = async ({ reply, userId, parentId, cUser }: { reply: PrismaComment, userId: string, parentId: string, cUser: User }) => {
    let isUpvoted;
    const hasPermission = cUser?.id === reply.authorId || checkRole("admin")

    if (cUser?.id) {
        isUpvoted = await prisma.upvote.findUnique({
            where: {
                userId_commentId: {
                    userId: cUser?.id!,
                    commentId: reply.id
                }
            }
        })
    }
    const upvoteCount = await prisma.upvote.aggregate({
        _count: {
            userId: true
        },
        where: {
            commentId: {
                in: [reply.id!]
            }
        }
    });

    return <Card className={`ml-4 mt-2`} key={reply.id}>
        <CardHeader>
            <CardDescription>
                <div className='flex items-center justify-between'>
                    <ReactMarkdown>{reply.content}</ReactMarkdown>
                    <CommentDropDown hasPermission={hasPermission} commentText={reply.content} commentId={reply.id} />
                </div>

            </CardDescription>

            <div className='flex items-center justify-between'>
                <ProfileImgCard
                    type={'comment'}
                    userId={userId}
                    createdAt={reply.createdAt}
                />

                <UpvoteComment comment={reply!} isUpvoted={!!isUpvoted} upvoteCount={upvoteCount._count.userId} />
            </div>
            <div>
                {cUser && 
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>
                            Reply
                        </AccordionTrigger>
                        <AccordionContent>
                            <CommentForm articleId={reply.articleId} parentId={parentId} />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                }
            </div>
        </CardHeader>

    </Card>
}