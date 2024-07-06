"use client"

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "@clerk/nextjs/server"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export default function Select({ users, userId }: { users: User[], userId: string }) {
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const { replace } = useRouter()
    const handleSearchParms = (userId: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('challengeeId', userId);
        console.log(params);
        replace(`${pathName}?${params.toString()}`);
    }

    const filteredUsers = users.filter(user => user.id != userId)
    return (
        <div>
            {filteredUsers.map(user => (
                <Card key={user.id}>
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle>{user.firstName} {user.lastName}</CardTitle>
                        <Button onClick={() => handleSearchParms(user.id)}>Select user</Button>
                    </CardHeader>



                </Card>
            ))}
        </div>
    )
}
