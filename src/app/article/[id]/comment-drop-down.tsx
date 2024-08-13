import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons"
import { Ellipsis } from "lucide-react"

export default function CommentDropDown({commentId}:{commentId: string}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={'ghost'}>
                    <Ellipsis />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Comment Options</DropdownMenuLabel>
                    <DropdownMenuItem>
                        <Pencil1Icon className="mr-1 h-4 w-4" />
                        Edit</DropdownMenuItem>
                    <DropdownMenuItem><TrashIcon className="mr-1 h-4 w-4" /> Delete</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Reports</DropdownMenuLabel>
                    <DropdownMenuItem>Spam</DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
