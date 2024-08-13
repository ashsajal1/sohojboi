"use client"
import LoaderIcon from "@/components/loader-icon";
// import all dialog component
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogHeader,
    DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState, useTransition } from "react";
import { editComment } from "./actions";


export default function EditDialog({
    open,
    onClose,
    value,
    commentId
}: {
    open: boolean;
    onClose: () => void;
    value: string;
    commentId: string
}) {
    const [pending, startTransition] = useTransition();
    const [editedComment, setEditedComment] = useState('')

    return (

        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <Textarea onChange={(e) => setEditedComment(e.target.value) } disabled={pending} defaultValue={value} placeholder='Edit question...' />
                </DialogHeader>
                <DialogFooter>
                    <Button disabled={pending} variant="ghost" onClick={onClose}>
                        Cancle
                    </Button>
                    <Button onClick={async () => {
                        await startTransition(async () => {
                            await editComment(commentId, editedComment);
                            onClose();
                        })
                    }} disabled={pending} variant="destructive">
                        {pending ? <><LoaderIcon /> Updating</> : "Update"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
