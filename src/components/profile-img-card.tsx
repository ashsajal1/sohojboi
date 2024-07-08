import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/date-format";

interface ProfileImgCardProps {
    profileImageSrc: string, fullName: string, type: string, userId: string, createdAt: Date
}
export default function ProfileImgCard({ profileImageSrc, fullName, type, userId, createdAt }: ProfileImgCardProps) {
    return (
        <Link className="flex items-center gap-2" href={`/profile?id=${userId}`}>
            {profileImageSrc && <Image className="rounded-full" width={30} height={30} src={profileImageSrc} alt={"Profile image"} />}
            <p className="flex flex-col text-sm">
                {fullName}
                <span className="text-[12px] text-muted-foreground">
                    {type === 'question' ? 'Asked' : 'Answered'} {formatDate(createdAt)}</span>
            </p>
        </Link>

    )
}
