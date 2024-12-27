import Link from "next/link";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import { SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";
import { BellIcon } from "@radix-ui/react-icons";
import { Badge } from "./ui/badge";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { Notification } from "@prisma/client";
import Logo from "./logo";
import Image from "next/image";
import AnimatedGradientText from "@/components/magicui/animated-gradient-text";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  CircleUser,
  LayoutDashboard,
  LogOut,
  Settings2,
  ChevronRight,
  BookOpen,
  Swords,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default async function Navbar() {
  const user = await currentUser();
  let notifications: null | Notification[] = null;
  if (user?.id) {
    try {
      notifications = await prisma.notification.findMany({
        where: {
          userId: user.id as string,
          read: false,
        },
      });
    } catch (error) {
      notifications = null;
    }
  }
  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <Logo />
      <div className="flex items-center gap-2">
        <Link href={"/article"}>
          <AnimatedGradientText>
            📖 <hr className="mx-2 h-4 w-[1px] shrink-0 bg-gray-300" />{" "}
            <span
              className={cn(
                `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`
              )}
            >
              Blog
            </span>
            <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedGradientText>
        </Link>
        {user?.publicMetadata.role === "admin" && (
          <Link href={"/admin/panel"}>
            <Button variant={"ghost"}>Admin</Button>
          </Link>
        )}

        <ModeToggle />
        <SignedIn>
          <Link href={"/notifications"}>
            <Button className="relative mx-2" size={"icon"} variant={"outline"}>
              {(notifications?.length || 0 > 0) && (
                <Badge
                  className="absolute -right-3 -top-3"
                  variant={"destructive"}
                >
                  {notifications?.length}
                </Badge>
              )}
              <BellIcon />
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} size={"icon"} className="rounded-full">
                <Image
                  className="contain rounded-full"
                  src={user?.imageUrl!}
                  alt={user?.fullName!}
                  width={30}
                  height={30}
                />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="flex flex-col gap-2 p-4">
              <div className="flex items-center gap-2">
                <Link className="w-full" href={"/profile"}>
                  <Button variant={"outline"} size="sm" className="w-full">
                    <CircleUser className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                <Link className="w-full" href={"/dashboard"}>
                  <Button variant={"outline"} size="sm" className="w-full">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-between gap-2 w-full">
                <Link className="w-full" href="/article">
                  <Button variant={"outline"} size="sm" className="w-full">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Blogs
                  </Button>
                </Link>

                <Link className="w-full" href="/challenge">
                  <Button variant={"outline"} size="sm" className="w-full">
                    <Swords className="w-4 h-4 mr-2" />
                    Challenges
                  </Button>
                </Link>
              </div>
              <Link href="/account">
                <Button variant={"outline"} size="sm" className="w-full">
                  <Settings2 className="w-4 h-4 mr-2" />
                  Manage Account
                </Button>
              </Link>

              <Button variant={"destructive"} size="sm" className="w-full">
                <LogOut className="w-4 h-4 mr-2" />
                <SignOutButton />
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        </SignedIn>
        <SignedOut>
          <Link href={"/login"}>
            <Button>Login</Button>
          </Link>
        </SignedOut>
      </div>
    </nav>
  );
}
