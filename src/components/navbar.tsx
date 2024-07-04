import Link from "next/link";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between p-4 border-b">
            <Link href={'/'} className="font-bold text-xl">SohojBoi</Link>
            <div className="flex items-center gap-2">
                <ModeToggle />
                <Link href={'/question'}>
                    <Button>Question</Button>
                </Link>
            </div>
        </nav>
    )
}
