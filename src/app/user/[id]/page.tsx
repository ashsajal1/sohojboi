import { clerkClient } from "@clerk/nextjs/server";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
export default async function Page({ params }: { params: { id: string } }) {
    const user = await clerkClient().users.getUser(params.id)
    // console.log(user)
    return (
        <Card className="mt-2">
            <CardHeader>
                <CardTitle>Profile details of {user.fullName}</CardTitle>
            </CardHeader>
            <CardContent>
                <Image className="rounded-ull" width={100} height={100} alt="user image" src={user.imageUrl} />
                <p>{user.fullName}</p>
            </CardContent>
        </Card>
    )
}
