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
import { useTransition } from 'react';
import { deleteAnsComment } from './actions';
import LoaderIcon from '@/components/loader-icon';

export default function DeleteComment({ commentId }: { commentId: string }) {
    const [pending, startTransition] = useTransition()

    return (
        <Dialog>
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
                            await deleteAnsComment(commentId);
                        })
                    })
                    } disabled={pending} variant={'destructive'} type="submit">{pending ? <LoaderIcon /> : 'Yes'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}
