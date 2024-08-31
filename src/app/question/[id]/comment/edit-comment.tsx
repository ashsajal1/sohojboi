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

export default function EditComment() {
    return (
        <Dialog>
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
                <div className="grid gap-4 py-4">
                    <Textarea id="comment" className="col-span-3" />
                </div>
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
