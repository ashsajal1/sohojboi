"use client"

import { Button } from "@/components/ui/button";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import { updateAnswer } from "./actions";
import { useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function EditAnswer({ answerId, answerText, questionId }: { answerId: string, answerText: string, questionId: string }) {
    const [updatedAnswer, setUpdatedAnswer] = useState(answerText)
    const [isPending, startTransition] = useTransition();
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full" size={'sm'} variant={'outline'}>
                    <Pencil1Icon className="mr-1" />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit your answer</DialogTitle>
                    <Textarea placeholder="Enter updated answer..."
                        required
                        disabled={isPending}
                        name="updatedAnswerText" defaultValue={answerText} onChange={(e) => setUpdatedAnswer(e.target.value)} />
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button disabled={isPending} variant={'ghost'}>Cancle</Button>
                    </DialogClose>
                    <Button disabled={isPending} onClick={async () => {
                        startTransition(async () => {
                            await updateAnswer(answerId, updatedAnswer, questionId)
                        })

                    }} variant={'destructive'}>
                        {isPending ? 'Updating...' : 'Update'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
