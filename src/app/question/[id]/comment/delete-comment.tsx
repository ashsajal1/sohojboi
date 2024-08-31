"use client"
import { Button } from '@/components/ui/button'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from '@radix-ui/react-dialog';
import { useState, useTransition } from 'react';
import { deleteAnsComment } from './actions';
import LoaderIcon from '@/components/loader-icon';
import { toast } from "sonner"

export default function DeleteComment({ commentId }: { commentId: string }) {
    const [pending, startTransition] = useTransition()

    const [open, setOpen] = useState(false)
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <p className="text-red-500 cursor-pointer">Delete</p>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete Comment</DialogTitle>
                    <DialogDescription>
                        Are you sure to delete the comment?
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button disabled={pending} variant={'ghost'} type="submit">Cancle</Button>
                    </DialogClose>
                    <Button onClick={(async () => {
                        await startTransition(async () => {
                            const error = await deleteAnsComment(commentId);
                            if (error) {
                                // alert("Error")
                                setOpen(false);
                                toast.error("Cannot delete comment!", {
                                    description: "An error occurred while deleting the comment.",
                                })
                            }
                        })
                    })
                    } disabled={pending} variant={'destructive'} type="submit">{pending ? <LoaderIcon /> : 'Yes'}</Button>

                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}
