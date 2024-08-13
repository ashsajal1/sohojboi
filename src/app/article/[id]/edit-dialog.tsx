"use client";
import LoaderIcon from "@/components/loader-icon";
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
import * as z from "zod";
import ErrorText from "@/app/quiz/create/error-text";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const commentSchema = z.object({
  comment: z.string().min(1, "Comment cannot be empty"),
});

export default function EditDialog({
  open,
  onClose,
  value,
  commentId,
}: {
  open: boolean;
  onClose: () => void;
  value: string;
  commentId: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ comment: string }>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = async (data: { comment: string }) => {
    try {
      await startTransition(async () => {
        await editComment(commentId, data.comment);
        onClose();
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.log(err.issues[0].message);
        setError(err.issues[0].message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <Textarea
            {...register("comment", { required: true })}
            disabled={pending}
            defaultValue={value}
            placeholder="Edit question..."
          />
          {errors.comment && <ErrorText text={errors.comment.message!} />}
        </DialogHeader>
        <DialogFooter>
          <Button disabled={pending} variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={pending}
            variant="destructive"
          >
            {pending ? (
              <>
                <LoaderIcon /> Updating
              </>
            ) : (
              "Update"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}