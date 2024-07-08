"use client"

import { Button } from "@/components/ui/button"
import { readAllNotificaiton } from "./actions"
import { CheckIcon } from "@radix-ui/react-icons"
import { useAuth } from "@clerk/nextjs";

export default function MarkAllReadBtn() {
    const { isLoaded, userId } = useAuth();
    return (
        <>
            {isLoaded && <div className="flex items-end justify-end">
                <Button onClick={() => readAllNotificaiton(userId || '')} variant={"secondary"}>
                    <CheckIcon className="mr-2" />
                    Mark all as read
                </Button>
            </div>}
        </>
    )
}
