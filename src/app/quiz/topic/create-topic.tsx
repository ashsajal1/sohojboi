"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import React, { useState, useTransition } from 'react'
import { createTopic } from './actions';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

export default function CreateTopic() {
    const [topicName, setTopicName] = useState('');
    const [pending, startTransition] = useTransition();
    return (
        <form className='mt-3'>
            <Card>
                <CardHeader>
                    <CardTitle>Create topic : </CardTitle>
                </CardHeader>
                <CardContent>
                    <Input disabled={pending} value={topicName} onChange={(e) => setTopicName(e.target.value)} placeholder='Enter topic name...' />
                </CardContent>

                <CardFooter>
                    <Button disabled={pending} onClick={async () => {
                        await startTransition(async () => {
                            await createTopic(topicName);
                        })
                    }}>
                        {pending ? "Creating..." : "Create"}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}
