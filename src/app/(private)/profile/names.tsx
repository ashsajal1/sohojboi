import { clerkClient } from "@clerk/nextjs/server";
import { Competition } from "@prisma/client";

export const Names = async ({ challenge }: { challenge: Competition }) => {
    const challenger = (await clerkClient().users.getUser(challenge.challengerId)).lastName;
    const challengee = (await clerkClient().users.getUser(challenge.challengeeId)).lastName;
    return <>
        <p><strong>{challenger}&apos;s Score:</strong> {challenge.challengerScore}</p>
        <p><strong>{challengee}&apos;s Score:</strong> {challenge.challengeeScore}</p>
    </>
}