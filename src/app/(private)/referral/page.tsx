import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import ReferForm from "./refer-form";
import ReferInfo from "./refer-info";

export default async function ReferralPage() {
    let currentActiveUser, refer, isEligible;

    try {
        currentActiveUser = await currentUser();
        refer = await prisma.refer.findMany({ where: { refereeId: currentActiveUser?.id } });

        isEligible = refer.length > 0;
    } catch (error) {
        throw error;
    }

    return (
        <>
            <div className="p-4">
                {!isEligible ? <ReferForm userId={currentActiveUser?.id!} /> :
                    <p>Sorry, You are not eligible.</p>
                }

               <ReferInfo refer={refer} user={JSON.parse(JSON.stringify(currentActiveUser!))} />
            </div>
        </>
    )
}