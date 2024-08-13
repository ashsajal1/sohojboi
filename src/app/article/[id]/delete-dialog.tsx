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

export default function DeleteDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
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
          <Button variant="ghost" onClick={onClose}>
            No
          </Button>
          <Button variant="destructive">Yes, Delete!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}