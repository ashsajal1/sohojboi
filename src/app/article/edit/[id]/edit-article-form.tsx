"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState, useTransition } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { PopoverTrigger, Popover, PopoverContent } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Article, Topic, ArticleSection } from '@prisma/client';
import { ArrowUpIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from '@/lib/utils';
import { editArticle } from './actions';
import DeleteArticleBtn from './delete-btn';
import LoaderIcon from '@/components/loader-icon';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";
import {useRouter} from "next/navigation"

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

const EditArticleForm = ({ topics, article }: { topics: Topic[], article: Article & { sections: ArticleSection[] } }) => {
    const [open, setOpen] = useState(false);
    const [pending, startTransition] = useTransition();
    const router = useRouter();
    const { control, register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(articleSchema),
        defaultValues: {
            title: article.title,
            topic: article.topicId,
            sections: article.sections || [
                { title: 'Introduction', content: '' },
                { title: 'Conclusion', content: '' }
            ]
        }
    });

    const { fields: sections, remove, fields, insert } = useFieldArray({
        control,
        name: 'sections'
    });

    const onSubmit = async (data: FormData) => {
        await startTransition(async () => {
            const articleId = await editArticle(data.title, data.sections, data.topic, article.id);
            if(articleId) router.push(`/article/${articleId}`)
        });
    };

    const addSection = () => {
        const newSection = { title: '', content: '' };

        // Insert the new section before the last section (Conclusion)
        insert(fields.length - 1, newSection); // Insert at second last position
    };

    return (
        <div className='p-4'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='flex items-center justify-between'>
                    <h3>Edit article:</h3>
                    <DeleteArticleBtn article={article} />
                </div>
                <div className='flex flex-col gap-2 mt-4'>
                    <h2 className="text-lg font-medium">Topic</h2>
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
                                        <CommandGroup>
                                            <CommandList>
                                                {topics.map((topic) => (
                                                    <CommandItem
                                                        key={topic.id}
                                                        value={topic.name}
                                                        onSelect={() => {
                                                            field.onChange(topic.id);
                                                            setOpen(false);
                                                        }}
                                                    >
                                                        <CheckIcon className={cn("mr-2 h-4 w-4", field.value === topic.name ? "opacity-100" : "opacity-0")} />
                                                        {topic.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandList>
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        )}
                    />
                    {errors.topic && <span className="text-red-500">{errors.topic.message}</span>}

                    <h2 className="text-lg font-medium">Title</h2>
                    <Input
                        disabled={pending}
                        {...register('title')}
                        placeholder='Enter title...'
                    />
                    {errors.title && <span className="text-red-500">{errors.title.message}</span>}

                    <h2 className="text-lg font-medium">Sections</h2>
                    {sections.map((section, index) => (
                        <div key={section.id} className="border rounded-md p-4 mb-4 shadow-sm">
                            <Input
                                disabled={pending || index === 0 || index === sections.length - 1}
                                placeholder={index === 0 ? 'Introduction' : index === sections.length - 1 ? 'Conclusion' : `Section ${index + 1} Title`}
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
                            {index !== 0 && index !== sections.length - 1 && (
                                <Button onClick={() => remove(index)} variant="destructive" className="mt-2 w-full">
                                    Delete Section
                                </Button>
                            )}
                        </div>
                    ))}
                    <Button disabled={pending} variant="outline" onClick={addSection} className="w-full mt-4">
                        Add Section
                    </Button>
                </div>
                <div className='flex mt-2 w-full justify-end'>
                    <Button disabled={pending} className='w-full' type="submit">
                        {pending ? <><LoaderIcon /> Saving</> : 'Save'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EditArticleForm;
