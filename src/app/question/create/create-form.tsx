"use client"
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createQuestion } from "./actions";
import { useFormState, useFormStatus } from "react-dom";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { ZodFormattedError } from 'zod';
import { PopoverTrigger, Popover, PopoverContent } from "@/components/ui/popover";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useState } from "react";
import { Topic } from "@prisma/client";
import { Label } from "@radix-ui/react-label";

type ErrorState = ZodFormattedError<{ title: string; description: string; }, string> | { error: string } | null

export default function CreateForm({ topics }: { topics: Topic[] }) {
    const [errorState, createQuestionAction] = useFormState(createQuestion, null);

    const errorMessage: ErrorState = errorState;

    return (
        <div>
            <form action={createQuestionAction}>
                <CardContent>
                    <InputFields topics={topics} />
                    {
                        errorState && <Alert className="mt-2" variant="destructive">
                            <ExclamationTriangleIcon />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {renderErrorState(errorMessage)}
                            </AlertDescription>
                        </Alert>
                    }

                </CardContent>
                <CardFooter>
                    <SubmitButton />
                </CardFooter>
            </form>
        </div>
    )
}

const SubmitButton = () => {
    const { pending } = useFormStatus();
    return <>
        <Button className="w-full">
            {pending ? 'Submitting...' : 'Submit'}
        </Button>
    </>
}

const InputFields = ({ topics }: { topics: Topic[] }) => {
    const { pending } = useFormStatus();
    const [selectedTopic, setSelectedTopic] = useState('')
    const [open, setOpen] = useState(false)
    return <>
        <Popover open={open}>
            <Label>Select topic : </Label>
            <PopoverTrigger disabled={pending} className="mb-2" asChild>
                <Button onClick={() => setOpen(true)} variant={'outline'} type={'button'}>
                    {selectedTopic ? topics.find(t => t.id === selectedTopic)?.name || '' : 'Select topic'}
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <Command>

                    <CommandInput placeholder="Search topic..."></CommandInput>

                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>

                            {topics.map(topic => (
                                <CommandItem key={topic.id} value={topic.id} onSelect={(currentValue) => {
                                    setSelectedTopic(currentValue);
                                    setOpen(false);
                                }}>{topic.name}</CommandItem>
                            ))}

                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
        <Input disabled={pending} name="title" placeholder="Enter title..." />
        <Textarea disabled={pending} name="description" rows={12} placeholder="Enter description..." className="mt-3" />

        <input type="hidden" name="topic" value={selectedTopic} />
    </>
}

const renderErrorState = (errorState: ErrorState) => {
    if (errorState !== null) {
        if ('error' in errorState) {
            return <div>{errorState.error}</div>;
        }

        return (
            <>
                {errorState.title && errorState.title._errors.map((error: any, index: any) => (
                    <div key={index}>{error}</div>
                ))}
                {errorState.description && errorState.description._errors.map((error: any, index: any) => (
                    <div key={index}>{error}</div>
                ))}
            </>
        );
    }
};
