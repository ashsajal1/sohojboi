import Link from "next/link";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import { SignedIn, SignedOut, SignOutButton } from '@clerk/nextjs'
import { BellIcon } from "@radix-ui/react-icons";
import { Badge } from "./ui/badge";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { Notification } from "@prisma/client";
import Logo from "./logo";
import Image from "next/image";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { CircleUser, LayoutDashboard, LogOut, Settings2 } from "lucide-react";

export default async function Navbar() {
    const user = await currentUser();
    let notifications: null | Notification[] = null;
    if (user?.id) {
        try {
            notifications = await prisma.notification.findMany({
                where: {
                    userId: user.id as string,
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
                {user?.publicMetadata.role === 'admin' && (
                    <Link href={'/admin'}>
                        <Button variant={'ghost'}>
                            Admin
                        </Button>
                    </Link>
                )}

                <ModeToggle />
                <SignedIn>
                    <Link href={'/notifications'}>
                        <Button className="relative mx-2" size={'icon'} variant={'outline'}>
                            {(notifications?.length || 0 > 0) && <Badge className="absolute -right-3 -top-3" variant={'destructive'}>{notifications?.length}</Badge>}
                            <BellIcon />
                        </Button>
                    </Link>

                    <HoverCard>
                        <HoverCardTrigger asChild>
                            <Button variant={'ghost'} size={'icon'} className="rounded-full">
                                <Image className="contain rounded-full" src={user?.imageUrl!} alt={user?.fullName!} width={30} height={30} />
                            </Button>
                        </HoverCardTrigger>

                        <HoverCardContent className="flex flex-col gap-2">
                            <Link href={'/profile'} className="w-full">
                                <Button
                                    variant={'outline'}
                                    size='sm'
                                    className="w-full">
                                    <CircleUser className="w-4 h-4 mr-2" />
                                    Profile</Button>

                            </Link>
                            <Link href={'/dashboard'} className="w-full">
                                <Button
                                    variant={'outline'}
                                    size='sm'
                                    className="w-full">
                                        <LayoutDashboard className="w-4 h-4 mr-2" />Dashboard</Button>

                            </Link>

                            <Button
                                variant={'outline'}
                                size='sm'
                                className="w-full"
                            >
                                <Settings2 className="w-4 h-4 mr-2" />
                                Manage Account
                            </Button>
                            <Button
                                variant={'destructive'}
                                size='sm'
                                className="w-full">
                                <LogOut className="w-4 h-4 mr-2" />
                                <SignOutButton />
                            </Button>
                        </HoverCardContent>
                    </HoverCard>

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
