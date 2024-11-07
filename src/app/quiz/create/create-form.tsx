"use client"
import React, { useEffect } from 'react';
import { z } from 'zod';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Topic, Article } from '@prisma/client';
import { ArrowUpIcon, CheckIcon, PlusCircledIcon, TrashIcon } from "@radix-ui/react-icons"
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
import { createChallengeQuestion } from './actions';
import { Separator } from '@/components/ui/separator';
import ErrorText from './error-text';
import ConfirmDialog from './confirm-dialog';

const questionSchema = z.object({
    content: z.string().nonempty({ message: 'Content is required' }),
    correctOption: z.string().nonempty({ message: 'Correct option is required' }),
    topic: z.string().nonempty({ message: 'Topic is required' }),
    article: z.string(),
    tags: z.string().optional(),
    options: z.array(z.object({
        content: z.string().nonempty({ message: 'Option content is required' })
    })).min(1, { message: 'At least 1 options are required' })
        .max(4, { message: 'No more than 4 options are allowed' })
});

export type QuestionFormData = z.infer<typeof questionSchema>;

export default function CreateForm({ topics, articles }: { topics: Topic[], articles: Article[] }) {
    const [isTopicOpen, setIsTopicOpen] = React.useState(false)
    const [isArticleOpen, setIsArticleOpen] = React.useState(false)
    const [formData, setFormData] = React.useState<QuestionFormData | null>(null)
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const { register, handleSubmit, formState: { errors }, control } = useForm<QuestionFormData>({
        resolver: zodResolver(questionSchema)
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'options',
    });

    const options = fields.map((field) => ('options' in field ? field.options : []));

    const addOption = () => {
        if (fields.length < 3) {
            append({ content: '' });
        }
    };

    const removeOption = (index: number) => {
        if (fields.length > 0) {
            remove(index);
        }
    };

    const onSubmit = async (data: QuestionFormData) => {
        // createChallengeQuestion(data)
        setFormData(data)
    };

    useEffect(() => {
        if (formData !== null) {
            setIsDialogOpen(true)
        }
    }, [formData])

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <Label>Content</Label>
            <Input placeholder='Enter the question... eg, Who created education?' {...register('content')} />
            {errors.content && <ErrorText text={errors.content.message!} />}

            <br />
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
                                aria-expanded={open}
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
                                aria-expanded={open}
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
            {errors.topic && <ErrorText text={errors.topic.message!} />}

            {/* <br />
            <Label>Tags</Label>
            <Input placeholder='Tags' {...register('tags')} /> */}

            <Separator className='mt-2' />
            <div className='mt-3'>
                <Label>Correct Option</Label>
                <Input placeholder='Correct option' {...register('correctOption')} />
                {errors.correctOption && <ErrorText text={errors.correctOption.message!} />}
                <Label className='mt-3'>Wrong Options</Label>
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-1 my-2">
                        <Input
                            placeholder={`Option ${index + 1}`}
                            {...register(`options.${index}.content` as const)}
                        />
                        <Button type="button" variant={'destructive'} onClick={() => removeOption(index)}>
                            <TrashIcon className='mr-1' />
                            Remove</Button>
                    </div>
                ))}
                {errors.options && <ErrorText text={errors.options.message!} />}
            </div>

            <Button disabled={options.length === 3} type="button" variant={'secondary'} className='w-full my-2' onClick={addOption}>
                <PlusCircledIcon className='mr-1' />
                {options.length === 3 && 'Options limit exceed.'}
                {options.length > 0 && options.length < 3 && 'Add Another Option'}
                {options.length === 0 && 'Add Option'}
            </Button>
            <Button className='w-full' type="submit">Submit</Button>
           {formData &&  <ConfirmDialog formData={formData!} isDialogOpen={isDialogOpen} />}
        </form>
    );
}
