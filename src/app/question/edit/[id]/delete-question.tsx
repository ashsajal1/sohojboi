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

export default function DeleteQuestion({ questionId }: { questionId: string }) {
    const [isPending, startTransition] = useTransition();
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="mt-2" variant={'destructive'}>
                    <TrashIcon className="mr-1" />
                    Delete Question
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
                    <Button onClick={async () => {
                        startTransition(async () => {
                            await deleteQuestion(questionId)
                        })

                    }} variant={'destructive'}>
                        {isPending? 'Deleting...':'Yes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
