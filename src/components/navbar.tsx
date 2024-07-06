import Link from "next/link";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { BellIcon } from "@radix-ui/react-icons";
import { Badge } from "./ui/badge";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Notification } from "@prisma/client";

export default async function Navbar() {
    const userId = auth().userId;
    let notifications: null | Notification[] = null;
    if (userId) {
        try {
            notifications = await prisma.notification.findMany({
                where: {
                    userId: userId as string,
                    read: false
                }
            })
        } catch (error) {
            notifications = null
        }
    }
    return (
        <nav className="flex items-center justify-between p-4 border-b">
            <Link href={'/'} className="font-bold text-xl">SohojBoi</Link>
            <div className="flex items-center gap-2">
                <ModeToggle />
                <SignedIn>
                    <Link href={'/notifications'}>
                        <Button className="relative mx-2" size={'icon'} variant={'outline'}>
                            {notifications?.length || 0 > 0 && <Badge className="absolute -right-3 -top-3" variant={'destructive'}>{notifications?.length}</Badge>}
                            <BellIcon />
                        </Button></Link>
                </SignedIn>

                <Link href={'/question'}>
                    <Button>Question</Button>
                </Link>
                <SignedIn>
                    <UserButton />
                </SignedIn>
                <SignedOut>
                    <Link href={'/login'}>
                        <Button>Login</Button>
                    </Link>
                </SignedOut>
            </div>
        </nav>
    )
}
