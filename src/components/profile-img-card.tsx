import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/date-format";
import { getProfile } from "@/app/_actions/get-profile";
import { Profile } from "@prisma/client";
import { Skeleton } from "./ui/skeleton";

type Type = "answer" | "question" | "comment" | "article" | "challengeResult";
interface ProfileImgCardProps {
    type: Type, 
    userId: string, 
    createdAt?: Date, 
    challengeStatus?: string, 
    leftSideImage?: boolean
}

export default async function ProfileImgCard({ 
    type, 
    userId, 
    createdAt, 
    challengeStatus, 
    leftSideImage = true 
}: ProfileImgCardProps) {
    const [user, profile] = await getProfile(userId);

    if (!user || !profile) {
        return <Skeleton className="w-1/3 h-[40px]" />;
    }

    const profileImg = user.imageUrl;
    const fullName = user.firstName + " " + user.lastName;
    const isVerified = profile?.badge.includes("VERIFIED");

    return (
        <Link className="flex items-center gap-2" href={`/profile?id=${userId}`}>
            {(profileImg && leftSideImage) && <Image className="rounded-full" width={30} height={30} src={profileImg} alt={"Profile image"} />}
            <div className="flex flex-col text-sm">
                <div className="flex items-center gap-1">
                    <span>{fullName}</span>
                    {isVerified && <Image src="/verified.svg" width={15} height={15} alt="verified" /> }
                </div>
                <span className={`text-[12px] text-muted-foreground ${!leftSideImage ? 'ml-auto' : ''}`}>
                    {textFormat(type)} {createdAt && formatDate(createdAt)} {challengeStatus && challengeStatus}</span>
            </div>
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