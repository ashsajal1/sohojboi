"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState, useTransition } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { PopoverTrigger, Popover, PopoverContent } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Topic } from '@prisma/client';
import { ArrowUpIcon, CheckIcon } from "@radix-ui/react-icons"
import { cn } from '@/lib/utils';
import { createArticle } from './actions';
import LoaderIcon from '@/components/loader-icon';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";

// Define validation schema using zod
const articleSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must not exceed 100 characters').nonempty('Title is required'),
    content: z.string().min(10, 'Content must be at least 10 characters').max(10000, 'Content must not exceed 10000 characters').nonempty('Content is required'),
    topic: z.string({ required_error: 'Topic selection is required' }).nonempty('Topic selection is required'), // Add validation for selectedTopic
});

// TypeScript types for form data
type FormData = z.infer<typeof articleSchema>;

const CreateArticleForm = ({ topics }: { topics: Topic[] }) => {
    const [open, setOpen] = useState(false);
    const [pending, startTransition] = useTransition();
    const { control, register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(articleSchema)
    });

    const onSubmit = async (data: FormData) => {
        await startTransition(async () => {
            await createArticle(data.title, data.content, data.topic)
        })
    };

    return (
        <div className="p-4">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2 className="text-lg font-medium">Topic</h2>
                <Controller
                    control={control}
                    name="topic"
                    render={({ field }) => (
                        <Popover open={open} onOpenChange={setOpen}>

                            <PopoverTrigger className='w-full' asChild>
                                <Button
                                    disabled={pending}
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full justify-between"
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
                                    {/* <CommandGroup> */}
                                        <CommandList>
                                            {Array.isArray(topics) && topics.length > 0 ? (
                                                topics.map((topic) => (
                                                    <CommandItem
                                                        key={topic.id}
                                                        value={topic.name}
                                                        onSelect={(currentValue) => {
                                                            field.onChange(topics.find((t) => t.name === currentValue)?.id);
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
                                    {/* </CommandGroup> */}
                                </Command>
                            </PopoverContent>
                        </Popover>
                    )}
                />

                {errors.topic && <span className="text-red-500">{errors.topic.message}</span>}

                <div className='flex flex-col gap-2 mt-4'>
                    <h2 className="text-lg font-medium">Title</h2>
                    <Input
                        disabled={pending}
                        {...register('title')}
                        placeholder='Enter title...'
                    />
                    {errors.title && <span className="text-red-500">{errors.title.message}</span>}
                    <h2 className="text-lg font-medium">Content</h2>

                    <Controller
                        name="content"
                        control={control}
                        render={({ field }) => <MDEditor previewOptions={{
                            rehypePlugins: [[rehypeSanitize]],
                        }} value={field.value} onChange={field.onChange} />}
                    />

                    {errors.content && <span className="text-red-500">{errors.content.message}</span>}
                </div>

                <Button className='w-full mt-4' disabled={pending} type="submit">
                    {pending ? <><LoaderIcon /> Creating</> : 'Create'}
                </Button>
            </form>

        </div>
    );
};

export default CreateArticleForm;
