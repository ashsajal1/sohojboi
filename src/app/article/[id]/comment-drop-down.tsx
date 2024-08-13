"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { Ellipsis } from "lucide-react";
import DeleteDialog from "./delete-dialog";
import EditDialog from "./edit-dialog";

export default function CommentDropDown({ commentId, commentText }: { commentId: string, commentText: string }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'ghost'}>
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Comment Options</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
              <Pencil1Icon className="mr-1 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteClick}>
              <TrashIcon className="mr-1 h-4 w-4" />
              Delete
            </DropdownMenuItem>
            <DropdownMenuLabel>Reports</DropdownMenuLabel>
            <DropdownMenuItem>Spam</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteDialog open={isDeleteDialogOpen} onClose={handleDeleteDialogClose} commentId={commentId} />
      <EditDialog commentId={commentId} value={commentText} open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} />
    </>
  );
}