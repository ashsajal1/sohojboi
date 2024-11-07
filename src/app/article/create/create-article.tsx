"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState, useTransition } from 'react';
import { useForm, Controller } from 'react-hook-form';
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

// TypeScript types for form data
type FormData = z.infer<typeof articleSchema>;

const CreateArticleForm = ({ topics }: { topics: Topic[] }) => {
    const [open, setOpen] = useState(false);
    const [pending, startTransition] = useTransition();
    const [sections, setSections] = useState([
        { id: 'intro', title: 'Introduction', content: '', isFixed: true },
        { id: 'main', title: 'Main Body', content: '', isFixed: false },
        { id: 'conclusion', title: 'Conclusion', content: '', isFixed: true }
    ]);

    const { control, register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(articleSchema),
        defaultValues: { sections }
    });

    const onSubmit = async (data: FormData) => {
        await startTransition(async () => {
            await createArticle(data.title, "data.sections", data.topic);
        });
    };

    // Section management functions
    const addSection = () => setSections([...sections, { id: Date.now().toString(), title: '', content: '', isFixed: false }]);

    const deleteSection = (id: string) => setSections(sections.filter(section => section.id !== id || section.isFixed));

    const handleSectionChange = (id: string, field: 'title' | 'content', value: string) => {
        setSections(sections.map(section => 
            section.id === id ? { ...section, [field]: value } : section
        ));
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
                    {sections.map((section, index) => (
                        <div key={section.id} className="border rounded-md p-4 mb-4 shadow-sm">
                            <Input
                                disabled={section.isFixed || pending}
                                value={section.title}
                                placeholder={`Section ${index + 1} Title`}
                                onChange={(e) => handleSectionChange(section.id, 'title', e.target.value)}
                                className="mb-2"
                            />
                            {errors.sections?.[index]?.title && (
                                <span className="text-red-500">{errors.sections[index].title?.message}</span>
                            )}
                            <MDEditor
                                previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
                                value={section.content}
                                onChange={(value) => handleSectionChange(section.id, 'content', value || '')}
                            />
                            {errors.sections?.[index]?.content && (
                                <span className="text-red-500">{errors.sections[index].content?.message}</span>
                            )}
                            {!section.isFixed && (
                                <Button onClick={() => deleteSection(section.id)} variant="destructive" className="mt-2 w-full">
                                    Delete Section
                                </Button>
                            )}
                        </div>
                    ))}
                    <Button onClick={addSection} className="w-full mt-4">
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
