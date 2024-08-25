import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

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
                {!isEligible ? <form className='flex flex-col gap-2'>
                    <Input placeholder='Enter referral code..' />
                    <Button type="submit">Submit</Button>
                </form> :
                    <p>Sorry, You are not eligible.</p>
                }
            </div>
        </>
    )
}