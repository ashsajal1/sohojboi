"use client";

import { type Comment as PrismaComment } from '@prisma/client';
import React from 'react';
import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import { User } from '@clerk/nextjs/server';
import ProfileImgCard from '@/components/profile-img-card';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import CommentForm from './comment-form';
import ReactMarkdown from '@uiw/react-markdown-preview';
import CommentDropDown from './comment-drop-down';
import { checkRole } from '@/lib/roles';
import UpvoteComment from './upvote-comment';

interface CommentProps {
    comment: PrismaComment;
    user: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        imageUrl: string;
        username: string | null;
    };
    isUpvoted: boolean;
    upvoteCount: number;
    hasPermission: boolean;
    commentReplies: PrismaComment[];
};

export default function Comment({ comment, user, isUpvoted, upvoteCount, hasPermission, commentReplies }: CommentProps) {
    return (
        <Card className={`mt-2`} key={comment.id}>
            <CardHeader>
                <CardDescription>
                    <div className='flex items-center justify-between'>
                        <div className="prose dark:prose-invert">
                            <ReactMarkdown source={comment.content} />
                        </div>
                        <CommentDropDown hasPermission={hasPermission} commentText={comment.content} commentId={comment.id} />
                    </div>
                </CardDescription>
                <div className='flex items-center justify-between'>
                    <ProfileImgCard
                        type={'comment'}
                        userId={user.id}
                        createdAt={comment.createdAt}
                    />
                    <UpvoteComment comment={comment!} isUpvoted={isUpvoted} upvoteCount={upvoteCount} />
                </div>
                <div>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>
                                Reply
                            </AccordionTrigger>
                            <AccordionContent>
                                <CommentForm articleId={comment.articleId} parentId={comment.id} />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </CardHeader>
            {commentReplies && (
                commentReplies?.map(reply => (
                    <Reply 
                        key={reply.id} 
                        reply={reply} 
                        userId={reply.authorId} 
                        parentId={comment.id}
                        isUpvoted={false}
                        upvoteCount={0}
                        hasPermission={false}
                    />
                ))
            )}
        </Card>
    );
}

interface ReplyProps {
    reply: PrismaComment;
    userId: string;
    parentId: string;
    isUpvoted: boolean;
    upvoteCount: number;
    hasPermission: boolean;
}

const Reply = ({ reply, userId, parentId, isUpvoted, upvoteCount, hasPermission }: ReplyProps) => {
    return (
        <Card className={`ml-4 mt-2`} key={reply.id}>
            <CardHeader>
                <CardDescription>
                    <div className='flex items-center justify-between'>
                        <div className="prose dark:prose-invert">
                            <ReactMarkdown source={reply.content} />
                        </div>
                        <CommentDropDown hasPermission={hasPermission} commentText={reply.content} commentId={reply.id} />
                    </div>
                </CardDescription>
                <div className='flex items-center justify-between'>
                    <ProfileImgCard
                        type={'comment'}
                        userId={userId}
                        createdAt={reply.createdAt}
                    />
                    <UpvoteComment comment={reply!} isUpvoted={isUpvoted} upvoteCount={upvoteCount} />
                </div>
                <div>
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
                </div>
            </CardHeader>
        </Card>
    );
}