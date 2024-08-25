import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ReferralPage() {
    return (
        <>
            <div>
                <form className='flex flex-col gap-2'>
                    <Input placeholder='Enter referral code..' />
                    <Button type="submit">Submit</Button>
                </form>
            </div>
        </>
    )
}