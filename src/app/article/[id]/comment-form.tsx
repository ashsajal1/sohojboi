"use client";

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import React, { useTransition } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createComment } from './actions';

// Define the schema for Zod validation
const commentSchema = z.object({
    content: z.string().min(1, 'Comment cannot be empty'),
});

// Define the TypeScript type for the form data
type CommentFormValues = z.infer<typeof commentSchema>

// Define the props for the CommentForm component
interface CommentFormProps {
    articleId?: string;
    parentId?: string;
}

export default function CommentForm({ articleId, parentId }: CommentFormProps) {
    const [pending, startTransition] = useTransition();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CommentFormValues>({
        resolver: zodResolver(commentSchema),
    });

    // Type the onSubmit function
    const onSubmit: SubmitHandler<CommentFormValues> = async (data) => {
        if (!articleId) {
            return;
        }

        startTransition(async () => {
            if (parentId) {
                await createComment(articleId, data.content, { type: 'nestedComment' }, parentId);
            } else {
                await createComment(articleId, data.content, { type: 'comment' });
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Textarea
                {...register('content')}
                disabled={pending}
                placeholder='Enter comment...'
            />
            {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
            <Button disabled={pending} className='mt-2'>
                {pending ? 'Submitting' : 'Submit'}
            </Button>
        </form>
    );
}