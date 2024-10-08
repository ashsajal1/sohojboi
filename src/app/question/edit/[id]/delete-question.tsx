"use client"

import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";

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
import { deleteQuestion } from "./actions";
import { useTransition } from "react";
import { useFormStatus } from "react-dom";
import LoaderIcon from "@/components/loader-icon";

export default function DeleteQuestion({ questionId }: { questionId: string }) {
    const [isPending, startTransition] = useTransition();
    const { pending } = useFormStatus();
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button disabled={pending} className="mt-2" variant={'destructive'}>
                    <TrashIcon className="mr-1" />
                    Delete
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your question
                        and remove your data from our servers.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button disabled={isPending} variant={'ghost'}>No</Button>
                    </DialogClose>
                    <Button disabled={pending} onClick={async () => {
                        startTransition(async () => {
                            await deleteQuestion(questionId)
                        })

                    }} variant={'destructive'}>
                        {isPending ? <><LoaderIcon /> Deleting...</> : 'Yes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
