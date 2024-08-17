"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import DeleteDialog from "./delete-dialog";
import EditDialog from "./edit-dialog";
import { Flag } from "lucide-react";

export default function CommentDropDown({ commentId, commentText, hasPermission }: { commentId: string, commentText: string, hasPermission : boolean }) {
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
            <DotsHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuGroup>
            {hasPermission && <>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
              <Pencil1Icon className="mr-1 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={handleDeleteClick}>
              <TrashIcon className="mr-1 h-4 w-4" />
              Delete
            </DropdownMenuItem></>}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Reports</DropdownMenuLabel>
            <DropdownMenuItem><Flag className="mr-1 h-4 w-4" />Spam</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteDialog open={isDeleteDialogOpen} onClose={handleDeleteDialogClose} commentId={commentId} />
      <EditDialog commentId={commentId} value={commentText} open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} />
    </>
  );
}