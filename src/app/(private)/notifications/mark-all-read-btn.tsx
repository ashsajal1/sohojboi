"use client"

import { Button } from "@/components/ui/button"
import { readAllNotificaiton } from "./actions"
import { CheckIcon } from "@radix-ui/react-icons"
import { useAuth } from "@clerk/nextjs";
import { useTransition } from "react";
import { LoaderCircle } from "lucide-react";

export default function MarkAllReadBtn() {
    const { isLoaded, userId } = useAuth();
    const [pending, startTransition] = useTransition();
    return (
        <>
            {isLoaded && <div className="flex items-end justify-end">
                <Button disabled={pending} onClick={async () => {
                    await startTransition(async () => {
                        await readAllNotificaiton(userId!);
                    })
                }} variant={"secondary"}>
                    {pending ?
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <CheckIcon className="mr-2" />}
                    Mark all as read
                </Button>
            </div>}
        </>
    )
}
