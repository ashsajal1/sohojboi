"use client"

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState, useTransition } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { PopoverTrigger, Popover, PopoverContent } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Article, Topic } from '@prisma/client';
import { ArrowUpIcon, CheckIcon, TrashIcon } from "@radix-ui/react-icons"
import { cn } from '@/lib/utils';
import { editArticle } from './actions';
import DeleteArticleBtn from './delete-btn';

// Define validation schema using zod
const articleSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must not exceed 100 characters').nonempty('Title is required'),
    content: z.string().min(10, 'Content must be at least 10 characters').max(10000, 'Content must not exceed 10000 characters').nonempty('Content is required'),
    topic: z.string({ required_error: 'Topic selection is required' }).nonempty('Topic selection is required'), // Add validation for selectedTopic
});

// TypeScript types for form data
type FormData = z.infer<typeof articleSchema>;

const EditArticleForm = ({ topics, article }: { topics: Topic[], article: Article }) => {
    const [open, setOpen] = useState(false);
    const [pending, startTransition] = useTransition();
    const { control, register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(articleSchema)
    });

    const onSubmit = async (data: FormData) => {
        await startTransition(async () => {
            await editArticle(data.title, data.content, data.topic, article.id)
        })
    };

    return (
        <div>
            <Card>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent>
                        <CardHeader>
                            <div className='flex items-center justify-between'>
                                <CardTitle>Write your article:</CardTitle>
                                <DeleteArticleBtn article={article} />
                            </div>
                            <div className='flex flex-col gap-2 mt-4'>
                                <Input
                                    disabled={pending}
                                    {...register('title')}
                                    placeholder='Enter title...'
                                    defaultValue={article.title}
                                />
                                {errors.title && <span className="text-red-500">{errors.title.message}</span>}
                                <Textarea
                                    disabled={pending}
                                    {...register('content')}
                                    placeholder='Enter content of article...'
                                    defaultValue={article.content}
                                    rows={10}
                                />
                                {errors.content && <span className="text-red-500">{errors.content.message}</span>}

                                <Controller
                                    control={control}
                                    name="topic"
                                    defaultValue={article.topicId}
                                    render={({ field }) => (
                                        <Popover open={open} onOpenChange={setOpen}>

                                            <PopoverTrigger asChild>
                                                <Button
                                                    disabled={pending}
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={open}
                                                    className="w-[200px] justify-between"
                                                    onClick={() => setOpen(true)}
                                                >
                                                    {field.value
                                                        ? topics.find((topic) => topic.id === field.value)?.name
                                                        : "Select topic..."}
                                                    <ArrowUpIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[200px] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search topic..." />
                                                    <CommandEmpty>No topic found.</CommandEmpty>
                                                    <CommandGroup>
                                                        <CommandList>
                                                            {Array.isArray(topics) && topics.length > 0 ? (
                                                                topics.map((topic) => (
                                                                    <CommandItem
                                                                        key={topic.id}
                                                                        value={topic.id}
                                                                        onSelect={(currentValue) => {
                                                                            field.onChange(currentValue);
                                                                            setOpen(false);
                                                                        }}
                                                                    >
                                                                        <CheckIcon
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                field.value === topic.name ? "opacity-100" : "opacity-0"
                                                                            )}
                                                                        />
                                                                        {topic.name}
                                                                    </CommandItem>
                                                                ))
                                                            ) : (
                                                                <CommandEmpty>No topics available</CommandEmpty>
                                                            )}
                                                        </CommandList>
                                                    </CommandGroup>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                />

                                {errors.topic && <span className="text-red-500">{errors.topic.message}</span>}
                            </div>
                        </CardHeader>

                        <CardFooter>
                            <Button disabled={pending} type="submit">
                                {pending ? 'Submiting' : 'Submit'}
                            </Button>
                        </CardFooter>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
};

export default EditArticleForm;