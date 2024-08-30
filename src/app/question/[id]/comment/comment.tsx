import { Separator } from '@/components/ui/separator'
import EditComment from './edit-comment'
export default function Comment() {
    return (
        <div className="text-sm text-muted-foreground/60">
            <div className="flex items-center gap-2">
                <p>This is my comment</p>
                <p className="font-semibold">- Ashfiquzzaman Sajal</p>
                <EditComment />
                <p className="text-red-600 cursor-pointer">Delete</p>
            </div>
            <Separator className="mt-2 w-full" />
        </div>
    )
}
