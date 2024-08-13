// import all dialog component
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog"

import {
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { TrashIcon } from "@radix-ui/react-icons";

export default function DeleteDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <DropdownMenuItem><TrashIcon className="mr-1 h-4 w-4" />Delete</DropdownMenuItem>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure you want to delete this article?</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    <Button variant='ghost'>No</Button>
                    <Button variant='destructive'>Yes, Delete!</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
