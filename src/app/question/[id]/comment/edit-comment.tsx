"use client"

import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { AnswerComment } from '@prisma/client';
import { useState, useTransition } from 'react';
import { editAnsComment } from './actions';
import LoaderIcon from '@/components/loader-icon';
import { z } from 'zod';

// Define the Zod schema for comment editing
const editCommentSchema = z.object({
    content: z.string().min(1, 'Content is required').max(500, 'Content must be less than 500 characters'),
});

type EditCommentFormData = z.infer<typeof editCommentSchema>;

export default function EditComment({ comment }: { comment: AnswerComment }) {
    const [pending, startTransition] = useTransition();
    const [open, setOpen] = useState(false);
    
    const { register, handleSubmit, formState: { errors } } = useForm<EditCommentFormData>({
        resolver: zodResolver(editCommentSchema),
        defaultValues: {
            content: comment.content, // Set default value for the textarea
        },
    });

    const onSubmit: SubmitHandler<EditCommentFormData> = async (data) => {
        await startTransition(async () => {
            await editAnsComment({ content: data.content }, comment.id);
            setOpen(false);
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <p className="text-blue-500 cursor-pointer">Edit</p>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Comment</DialogTitle>
                    <DialogDescription>
                        Make changes to your comment here. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Textarea disabled={pending} {...register('content')} id="comment" className="col-span-3" />
                    {errors.content && <span className="text-red-600 text-sm">{errors.content.message}</span>}
                    <DialogFooter className="justify-end pt-2">
                        <Button disabled={pending} type="submit">
                            {pending ? <LoaderIcon /> : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}