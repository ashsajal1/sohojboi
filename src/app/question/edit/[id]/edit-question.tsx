"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DeleteQuestion from "./delete-question";
import { updateQuestion } from "./actions";
import { useFormState, useFormStatus } from "react-dom";
import { Question, Topic } from "@prisma/client";
import { SubmitButton } from "@/components/submit-btn";
import { PopoverTrigger, Popover, PopoverContent } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon } from "lucide-react";

export default function EditQuestion({ question, topics }: { question: Question, topics: Topic[] }) {
    const [errorState, updateQuestionAction] = useFormState(updateQuestion, null)

    return (
        <div className="p-4">
            <form action={updateQuestionAction}>
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center w-full">
                            <CardTitle>Edit question</CardTitle>
                            <DeleteQuestion questionId={question.id} />
                        </div>
                    </CardHeader>

                    <CardContent>
                        <InputFields topics={topics} question={question} />
                    </CardContent>
                    <CardFooter>
                        <SubmitButton />
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}


const InputFields = ({ question, topics }: { question: Question, topics: Topic[] }) => {
    const { pending } = useFormStatus();
    
    return <>
        <Input disabled={pending} defaultValue={question.questionTitle} name="title" placeholder="Enter title..." />
        <Input className="hidden" defaultValue={question.id} hidden={true} name="questionId" placeholder="Enter title..." />
        <Textarea disabled={pending} defaultValue={question.questionDescription} name="description" rows={12} placeholder="Enter description..." className="mt-3" />
    </>
}
