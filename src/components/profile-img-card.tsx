import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/date-format";
import { clerkClient } from "@clerk/nextjs/server";

type Type = "answer" | "question" | "comment";
interface ProfileImgCardProps {
    type: Type, userId: string, createdAt: Date
}
export default async function ProfileImgCard({ type, userId, createdAt }: ProfileImgCardProps) {
    const user = await clerkClient().users.getUser(userId);
    const profileImg = user.imageUrl;
    const fullName = user.fullName;
    return (
        <Link className="flex items-center gap-2" href={`/profile?id=${userId}`}>
            {profileImg && <Image className="rounded-full" width={30} height={30} src={profileImg} alt={"Profile image"} />}
            <p className="flex flex-col text-sm">
                {fullName}
                <span className="text-[12px] text-muted-foreground">
                    {textFormat(type)} {formatDate(createdAt)}</span>
            </p>
        </Link>

    )
}

function textFormat(type: Type): string {
    switch (type) {
        case "question":
            return 'asked';
        case "answer":
            return "answered"
        case "comment":
            return "commented"
        default:
            return "asked"
    }
}