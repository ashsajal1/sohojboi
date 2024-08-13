"use client"
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


export default function EditDialog({
    open,
    onClose,
    value
}: {
    open: boolean;
    onClose: () => void;
    value: string;
}) {
    return (

        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <Textarea defaultValue={value} placeholder='Edit question...' />
                </DialogHeader>
                <DialogFooter>
                    <Button variant="ghost" onClick={onClose}>
                        Cancle
                    </Button>
                    <Button variant="destructive">Update!</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
