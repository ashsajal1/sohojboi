"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "@clerk/nextjs/server"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"

export default function Select({ users, userId }: { users: User[], userId: string }) {
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const { replace } = useRouter()
    const handleSearchParms = (userId: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('challengeeId', userId);
        replace(`${pathName}?${params.toString()}`);
    }

    const filteredUsers = users.filter(user => user.id != userId)

    return (
        <div className="flex flex-wrap gap-2">
            {filteredUsers.map(user => (
                <Card className="flex items-center justify-between p-4 gap-2" key={user.id}>
                    <Image className="rounded-full" width={30} height={30} src={user.imageUrl} alt={"Profile image"} />
                    <CardTitle>{user.firstName} {user.lastName}</CardTitle>
                    <Button onClick={() => handleSearchParms(user.id)}>Select user</Button>

                </Card>
            ))}
        </div>
    )
}
