/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { DataTableColumnHeader } from "../../../../../components/table-header"
import { Article } from "@prisma/client"
import DeleteArticle from "./delete-article"
import { useState } from "react"

// (alias) type Article = {
//     id: string;
//     title: string;
//     content: string;
//     authorId: string;
//     topicId: string;
//     createdAt: Date;
//     updatedAt: Date;
// }
// import Article

export const columns: ColumnDef<Article>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    // cell: ({row}) => <div></div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "content",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Content" />,
    cell: ({row}) => {
        let content = row.getValue("content") as string
        content = content.slice(0, 100) + "..."
        return <div>{content}</div>
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "authorId",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Creator" />,
    // cell: () => null,
    enableSorting: true,
    enableHiding: true,
  },
//   {
//     accessorKey: "status",
//     header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
//     // cell: () => null,
//     enableSorting: true,
//     enableHiding: true,
//   },
//   {
//     accessorKey: "approverdBy",
//     header: ({ column }) => <DataTableColumnHeader column={column} title="Approver" />,
//     // cell: () => null,
//     enableSorting: true,
//     enableHiding: true,
//   },

  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created On" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const formattedDate = date.toISOString().split('T')[0];

      return <div className="text-left font-medium">{formattedDate}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const question = row.original;
      const [open, setOpen] = useState(false)

      return (
        <>
          <DeleteArticle setOpen={setOpen} open={open} questionId={question.id} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(question.id)}
              >
                Copy article ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View article details</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpen(true)}>Delete article</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )
    },
  },
]
