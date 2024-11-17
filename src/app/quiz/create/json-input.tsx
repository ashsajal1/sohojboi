"use client"
import React, { useEffect } from 'react';
import { z } from 'zod';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Topic, Article, ArticleSection } from '@prisma/client';
import { ArrowUpIcon, CheckIcon, PlusCircledIcon, TrashIcon } from "@radix-ui/react-icons";
import { useSearchParams } from 'next/navigation'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from '@/lib/utils';
import { CommandList } from 'cmdk';
import { Separator } from '@/components/ui/separator';
import ErrorText from './error-text';
import { motion, AnimatePresence } from "framer-motion"
import { Textarea } from '@/components/ui/textarea';
import { createManyQuestions } from './actions';

const placeholder  = `[
    {
      "content": "What is the capital of France?",
      "options": ["Berlin", "Madrid", "Paris", "Rome"],
      "correctOption": "Paris",
      "hint": "It's a popular European tourist destination.",
      "explanation": "Paris is the capital of France."
    },
    ...
  ]`

const questionSchema = z.object({
    topic: z.string().nonempty({ message: 'Topic is required' }),
    article: z.string().optional(),
    articleSection: z.string().optional(),
    jsonData: z.string().nonempty({ message: "Json data is required" }),
});

export type QuestionFormData = z.infer<typeof questionSchema>;

export default function CreateForm({ topics, articles, articleSections }: { topics: Topic[], articles: Article[], articleSections: ArticleSection[] }) {
    const searchParams = useSearchParams()
    const articleId = searchParams.get('articleId');
    const topicId = searchParams.get('topicId');

    const [isTopicOpen, setIsTopicOpen] = React.useState(false)
    const [isArticleOpen, setIsArticleOpen] = React.useState(false);
    const [isSectionOpen, setIsSectionOpen] = React.useState(false)
    const [sections, setSections] = React.useState<ArticleSection[]>([])
    const [formData, setFormData] = React.useState<QuestionFormData | null>(null)

    const { register, handleSubmit, formState: { errors }, control, setValue, watch, setError } = useForm<QuestionFormData>({
        resolver: zodResolver(questionSchema)
    });

    const onSubmit = async (data: QuestionFormData) => {
        console.log("submitting ...");
        try {
            const array = JSON.parse(data.jsonData); 
            const questionIds: any = await createManyQuestions(data.topic, array, data.article);

            if(questionIds) {
                alert(questionIds)
            }
            
            if (!questionIds || questionIds.length === 0) {
                setError("jsonData", {
                    type: "manual",
                    message: "Invalid JSON input or question creation failed.",
                });
                console.error("Invalid JSON input or question creation failed");
            }
        } catch (error) {
            setError("jsonData", {
                type: "manual",
                message: "Invalid JSON input",
            });
            console.error("Invalid JSON input", error);
        }
    };
    

    useEffect(() => {
        if (articleId) {
            setValue('article', articleId);
        }
        if (topicId) {
            setValue('topic', topicId);
        }
    }, [articleId, setValue, topicId]);

    // Update the sections based on the selected article
    const selectedArticleId = watch("article");
    useEffect(() => {
        if (selectedArticleId) {
            const filteredSections = articleSections.filter(section => section.articleId === selectedArticleId);
            setSections(filteredSections);
        } else {
            setSections([]);
        }
    }, [selectedArticleId, articleSections]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Label className='mb-1 block'>Select Topic</Label>
            <Controller
                control={control}
                name="topic"
                render={({ field }) => (
                    <Popover open={isTopicOpen} onOpenChange={setIsTopicOpen}>
                        <PopoverTrigger className='w-full' asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={isTopicOpen}
                                className="w-full justify-between"
                                onClick={() => setIsTopicOpen(true)}
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
                                                    value={topic.name}
                                                    onSelect={(currentValue: string) => {
                                                        field.onChange(topics.find((t) => t.name === currentValue)?.id!);
                                                        setIsTopicOpen(false);
                                                    }}
                                                >
                                                    <CheckIcon
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            field.value === topic.id ? "opacity-100" : "opacity-0"
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

            {errors.topic && <ErrorText text={errors.topic.message!} />}
            <Label className='my-2 block'>Select Article (Optional)</Label>

            <Controller
                control={control}
                name="article"
                render={({ field }) => (
                    <Popover open={isArticleOpen} onOpenChange={setIsArticleOpen}>
                        <PopoverTrigger className='w-full' asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={isArticleOpen}
                                className="w-full justify-between"
                                onClick={() => setIsArticleOpen(true)}
                            >
                                {field.value
                                    ? articles.find((article) => article.id === field.value)?.title
                                    : "Select article..."}
                                <ArrowUpIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput placeholder="Search topic..." />
                                <CommandEmpty>No article found.</CommandEmpty>
                                <CommandGroup>
                                    <CommandList>
                                        {Array.isArray(articles) && articles.length > 0 ? (
                                            articles.map((article) => (
                                                <CommandItem
                                                    key={article.id}
                                                    value={article.title}
                                                    onSelect={(currentValue: string) => {
                                                        field.onChange(articles.find((t) => t.title === currentValue)?.id!);
                                                        setIsArticleOpen(false);
                                                    }}
                                                >
                                                    <CheckIcon
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            field.value === article.id ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {article.title}
                                                </CommandItem>
                                            ))
                                        ) : (
                                            <CommandEmpty>No article available</CommandEmpty>
                                        )}
                                    </CommandList>
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                )}
            />

            <AnimatePresence>
                {selectedArticleId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <Label className='my-2 block'>Select Article Section (Optional)</Label>
                        <Controller
                            control={control}
                            name="articleSection"
                            render={({ field }) => (
                                <Popover open={isSectionOpen} onOpenChange={setIsSectionOpen}>
                                    <PopoverTrigger className='w-full' asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={isSectionOpen}
                                            className="w-full justify-between"
                                            onClick={() => setIsSectionOpen(true)}
                                        >
                                            {field.value
                                                ? sections.find((section) => section.id === field.value)?.title
                                                : "Select article section..."}
                                            <ArrowUpIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Search section..." />
                                            <CommandEmpty>No section found.</CommandEmpty>
                                            <CommandGroup>
                                                <CommandList>
                                                    {Array.isArray(sections) && sections.length > 0 ? (
                                                        sections.map((section) => (
                                                            <CommandItem
                                                                key={section.id}
                                                                value={section.title}
                                                                onSelect={(currentValue: string) => {
                                                                    field.onChange(sections.find((s) => s.title === currentValue)?.id!);
                                                                    setIsSectionOpen(false);
                                                                }}
                                                            >
                                                                <CheckIcon
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        field.value === section.id ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                {section.title}
                                                            </CommandItem>
                                                        ))
                                                    ) : (
                                                        <CommandEmpty>No sections available</CommandEmpty>
                                                    )}
                                                </CommandList>
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            )}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <Separator className='mt-2' />
            <Textarea className="my-2" {...register('jsonData')} placeholder={placeholder} />
            {errors.jsonData && <ErrorText text={errors.jsonData.message!} />}
            <Button className='w-full mt-2' type="submit">Create MCQ</Button>
        </form>
    );
}
