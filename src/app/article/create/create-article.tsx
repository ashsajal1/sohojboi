"use client"

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Define validation schema using zod
const articleSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must not exceed 100 characters').nonempty('Title is required'),
    content: z.string().min(10, 'Content must be at least 10 characters').max(5000, 'Content must not exceed 5000 characters').nonempty('Content is required'),
    selectedTopic: z.string().nonempty('Topic selection is required'), // Add validation for selectedTopic
});

// TypeScript types for form data
type FormData = z.infer<typeof articleSchema>;

const CreateArticleForm: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(articleSchema)
    });

    const onSubmit = (data: FormData) => {
        // Handle form submission logic here
        console.log(data); // Replace with actual submission logic
    };

    return (
        <div>
            <Card>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent>
                        <CardHeader>
                            <CardTitle>Write your article:</CardTitle>
                            <div className='flex flex-col gap-2 mt-4'>
                                <Input
                                    {...register('title')}
                                    placeholder='Enter title...'
                                />
                                {errors.title && <span className="text-red-500">{errors.title.message}</span>}
                                <Textarea
                                    {...register('content')}
                                    placeholder='Enter content of article...'
                                />
                                {errors.content && <span className="text-red-500">{errors.content.message}</span>}

                            </div>
                        </CardHeader>

                        <CardFooter>
                            <Button type="submit">Submit</Button>
                        </CardFooter>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
};

export default CreateArticleForm;
