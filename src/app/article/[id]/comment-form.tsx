"use client";

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import React, { useState, useTransition } from 'react';
import { createComment } from './actions';

export default function CommentForm({ articleId, parentId }: { articleId?: string, parentId?: string }) {
    const [content, setContent] = useState('');
    const [pending, startTransition] = useTransition();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting comment:", content);
        console.log("articleId:", articleId);
        console.log("parentId:", parentId);

        if (!articleId) {
            console.error("articleId is required");
            return;
        }

        if (content !== '') {
            startTransition(async () => {
                if (parentId) {
                    console.log("Creating nested comment");
                    await createComment(articleId, content, { type: 'nestedComment' }, parentId);
                } else {
                    console.log("Creating top-level comment");
                    await createComment(articleId, content, { type: 'comment' });
                }
                setContent('');
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Textarea disabled={pending} value={content} onChange={(e) => setContent(e.target.value)} placeholder='Enter comment...' />
            <Button disabled={pending} className='mt-2'>
                {pending ? 'Submitting' : 'Submit'}
            </Button>
        </form>
    );
}
