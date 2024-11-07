"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState, useTransition } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { PopoverTrigger, Popover, PopoverContent } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandItem, CommandInput, CommandList } from "@/components/ui/command";
import { Topic } from '@prisma/client';
import { ArrowUpIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from '@/lib/utils';
import { createArticle } from './actions';
import LoaderIcon from '@/components/loader-icon';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";
import { useRouter } from "next/navigation"

// Define validation schema using zod
const sectionSchema = z.object({
    title: z.string().min(3, 'Section title must be at least 3 characters'),
    content: z.string().min(10, 'Section content must be at least 10 characters')
});

const articleSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must not exceed 100 characters').nonempty('Title is required'),
    topic: z.string({ required_error: 'Topic selection is required' }).nonempty('Topic selection is required'),
    sections: z.array(sectionSchema)
});

type FormData = z.infer<typeof articleSchema>;

const CreateArticleForm = ({ topics }: { topics: Topic[] }) => {
    const [open, setOpen] = useState(false);
    const [pending, startTransition] = useTransition();
    const router = useRouter();

    const { control, register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(articleSchema),
        defaultValues: {
            sections: [
                { title: 'Introduction', content: '' },
                { title: 'Main Body', content: '' },
                { title: 'Conclusion', content: '' }
            ]
        }
    });

    const { fields: sections, fields, append, remove, insert } = useFieldArray({
        control,
        name: 'sections'
    });

    const onSubmit = async (data: FormData) => {
        await startTransition(async () => {
            const articleId = await createArticle(data.title, data.sections, data.topic);
            if (articleId) {
                router.push(`/article/${articleId}`);
            }
        });
    };

    // Function to add a section before the last one (before 'Conclusion')
    const addSection = () => {
        const newSection = { title: '', content: '' };

        // Insert the new section before the last section (Conclusion)
        insert(fields.length - 1, newSection); // Insert at second last position
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
                                    <CommandList>
                                        {topics.map((topic) => (
                                            <CommandItem
                                                key={topic.id}
                                                value={topic.name}
                                                onSelect={(currentValue) => {
                                                    field.onChange(topics.find((t) => t.name === currentValue)?.id);
                                                    setOpen(false);
                                                }}
                                            >
                                                <CheckIcon className={cn("mr-2 h-4 w-4", field.value === topic.name ? "opacity-100" : "opacity-0")} />
                                                {topic.name}
                                            </CommandItem>
                                        ))}
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    )}
                />
                {errors.topic && <span className="text-red-500">{errors.topic.message}</span>}

                <div className="mt-4">
                    <h2 className="text-lg font-medium">Title</h2>
                    <Input disabled={pending} {...register('title')} placeholder="Enter article title..." />
                    {errors.title && <span className="text-red-500">{errors.title.message}</span>}
                </div>

                <div className="mt-6">
                    <h2 className="text-lg font-medium">Sections</h2>

                    {sections.map((section, index) => {
                        const isFixed = section.title === 'Introduction' || section.title === 'Conclusion';
                        return (
                            <div key={section.id} className="border rounded-md p-4 mb-4 shadow-sm">
                                <Input
                                    disabled={isFixed || pending}
                                    // value={section.title}
                                    placeholder={`Section ${index + 1} Title`}
                                    {...register(`sections.${index}.title`)}
                                    className="mb-2"
                                />
                                {errors.sections?.[index]?.title && (
                                    <span className="text-red-500">{errors.sections[index].title?.message}</span>
                                )}
                                <Controller
                                    control={control}
                                    name={`sections.${index}.content`}
                                    render={({ field }) => (
                                        <MDEditor
                                            previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
                                            value={field.value}
                                            onChange={(value) => field.onChange(value || '')}
                                        />
                                    )}
                                />
                                {errors.sections?.[index]?.content && (
                                    <span className="text-red-500">{errors.sections[index].content?.message}</span>
                                )}
                                {!isFixed && (
                                    <Button onClick={() => remove(index)} variant="destructive" className="mt-2 w-full">
                                        Delete Section
                                    </Button>
                                )}
                            </div>
                        );
                    })}

                    <Button disabled={pending} variant="" onClick={addSection} className="w-full mt-4">
                        Add Section
                    </Button>
                </div>

                <Button className="w-full mt-6" disabled={pending} type="submit">
                    {pending ? <><LoaderIcon /> Creating</> : 'Create'}
                </Button>
            </form>
        </div>
    );
};

export default CreateArticleForm;
