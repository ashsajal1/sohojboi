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
import { DialogClose } from '@radix-ui/react-dialog';


export default function DeleteComment() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <p className="text-red-600 cursor-pointer">Delete</p>
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
                        <Button variant={'ghost'} type="submit">Cancle</Button>
                    </DialogClose>
                    <Button variant={'destructive'} type="submit">Yes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
