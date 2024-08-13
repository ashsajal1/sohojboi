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
import { useTransition } from "react";
import { deleteComment } from "./actions";

export default function DeleteDialog({
  open,
  onClose,
  commentId,  // pass commentId from parent component to this component for deletion
}: {
  open: boolean;
  onClose: () => void;
  commentId: string;  
}) {

  const [pending, startTransiton] = useTransition();
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTrigger asChild>
        {/* No content here, as the trigger is handled in the parent component */}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this article?</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button disabled={pending} variant="ghost" onClick={onClose}>
            No
          </Button>
          <Button onClick={async () => {
            await startTransiton(async () => {
              await deleteComment(commentId)
            });
          }} disabled={pending} variant="destructive">
            {pending ? <><LoaderIcon /> Deleting</> : 'Yes, Delete!'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}