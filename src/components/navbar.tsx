import Link from "next/link";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { BellIcon } from "@radix-ui/react-icons";
import { Badge } from "./ui/badge";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Notification } from "@prisma/client";
import Logo from "./logo";

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
            <Logo />
            <div className="flex items-center gap-2">
                <Link href={'/article'}>
                    <Button variant={'ghost'}>
                        Blog
                    </Button>
                </Link>
                <ModeToggle />
                <SignedIn>
                    <Link href={'/notifications'}>
                        <Button className="relative mx-2" size={'icon'} variant={'outline'}>
                            {(notifications?.length || 0 > 0) && <Badge className="absolute -right-3 -top-3" variant={'destructive'}>{notifications?.length}</Badge>}
                            <BellIcon />
                        </Button>
                    </Link>

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
