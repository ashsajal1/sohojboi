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
} from "@/components/ui/dialog"
import { deleteQuestion } from "./actions";

export default function DeleteQuestion({ questionId }: { questionId: string }) {
    return (
        <Dialog>
            <DialogTrigger>
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
                    <Button variant={'ghost'}>No</Button>
                    <Button onClick={() => deleteQuestion(questionId)} variant={'destructive'}>Yes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
