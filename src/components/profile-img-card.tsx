import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/date-format";
import { clerkClient } from "@clerk/nextjs/server";

type Type = "answer" | "question" | "comment" | "article" | "challengeResult";
interface ProfileImgCardProps {
    type: Type, userId: string, createdAt?: Date, challengeStatus?: string, leftSideImage?: boolean
}
export default async function ProfileImgCard({ type, userId, createdAt, challengeStatus, leftSideImage = true }: ProfileImgCardProps) {
    const user = await clerkClient().users.getUser(userId);
    const profileImg = user.imageUrl;
    const fullName = user.fullName;
    return (
        <Link className="flex items-center gap-2" href={`/profile?id=${userId}`}>
            {(profileImg && leftSideImage) && <Image className="rounded-full" width={30} height={30} src={profileImg} alt={"Profile image"} />}
            <p className="flex flex-col text-sm">
                {fullName}
                <span className={`text-[12px] text-muted-foreground ${!leftSideImage ? 'ml-auto' : ''}`}>
                    {textFormat(type)} {createdAt && formatDate(createdAt)} {challengeStatus && challengeStatus}</span>
            </p>
            {(profileImg && !leftSideImage) && <Image className="rounded-full" width={30} height={30} src={profileImg} alt={"Profile image"} />}
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
        case "article":
            return "wrote"
        case "challengeResult":
            return ""
        default:
            return "asked"
    }
}