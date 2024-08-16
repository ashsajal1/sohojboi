"use client"
import React from 'react'
import { Button } from './ui/button'
import { Share2Icon } from 'lucide-react'
import { shareContent } from "@/lib/share"

export default function ShareBtn({title, description}: {title: string, description: string}) {
    const handleShare = () => {
        shareContent(
            title,
            description,
            window.location.href
        )
            .catch((error) => {
                alert('Sharing failed: ' + error.message);
            });
    };
    return (
        <Button size='sm' variant='outline' onClick={handleShare}><Share2Icon className='mr-2 h-4 w-4' />Share</Button>
    )
}
