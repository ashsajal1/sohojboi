"use client"

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import React, { useState, useTransition } from 'react'
import { createComment } from './actions';

export default function CommentForm({ articleId }: { articleId: string }) {
    const [content, setContent] = useState('');
    const [pending, startTransition] = useTransition()
    const handleSubmit = async () => {
        if(content !== ''){
            await startTransition(async () => {
                await createComment(articleId, content)
            })
        }
        
    }
    return (
        <form onSubmit={handleSubmit}>
            <Textarea disabled={pending} onChange={(e) => setContent(e.target.value)} placeholder='Enter comment...' />
            <Button disabled={pending} className='mt-2'>
                {pending ? 'Submitting' : 'Submit'}
            </Button>
        </form>
    )
}
