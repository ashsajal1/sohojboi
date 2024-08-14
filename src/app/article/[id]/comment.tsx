import { type Comment as PrismaComment } from '@prisma/client';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
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
import { Ellipsis, EllipsisIcon, Menu } from 'lucide-react';
import CommentDropDown from './comment-drop-down';
import { checkRole } from '@/lib/roles';

interface CommentProps {
    comment: PrismaComment;
};

export default async function Comment({ comment }: CommentProps) {
    const cUser = await currentUser();
    const user = await clerkClient().users.getUser(comment.authorId);
    const commentReplies = await prisma.comment.findMany({
        where: {
            parentId: comment.id
        }
    });

    const hasPermission = cUser?.id === comment.articleId || checkRole("admin")

    return (
        <Card className={`mt-2`} key={comment.id}>
            <CardHeader>
                <CardDescription>
                    <div className='flex items-center justify-between'>
                        <ReactMarkdown>{comment.content}</ReactMarkdown>
                        <CommentDropDown hasPermission={false} commentText={comment.content} commentId={comment.id} />
                    </div>
                </CardDescription>
                <ProfileImgCard
                    type={'comment'}
                    userId={user.id}
                    createdAt={comment.createdAt}
                />
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