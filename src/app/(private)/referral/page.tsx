import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import ReferForm from "./refer-form";

export default async function ReferralPage() {
    let currentActiveUser, refer, isEligible;

    try {
        currentActiveUser = await currentUser();
        refer = await prisma.refer.findFirst({ where: { refereeId: currentActiveUser?.id } });

        isEligible = !!refer?.refereeId;
    } catch (error) {
        throw error;
    }

    return (
        <>
            <div className="p-4">
                {!isEligible ? <ReferForm /> :
                    <p>Sorry, You are not eligible.</p>
                }
            </div>
        </>
    )
}