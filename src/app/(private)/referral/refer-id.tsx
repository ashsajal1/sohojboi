"use client"

import { Button } from "@/components/ui/button";
import { Clipboard, ClipboardCheck } from "lucide-react";
import { useState } from "react";

export default function ReferId({ referId }: { referId: string }) {

    const [isCopied, setIsCopied] = useState(false);

    const copyReferralCode = () => {
        navigator.clipboard.writeText(referId);
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    return (
        <div className="flex items-center gap-2">
            <p className="text-sm">Referral code: <code>{referId.slice(0,10)}...</code> <Button
                variant={'ghost'}
                className="transition-colors duration-300"
                onClick={copyReferralCode}
            >
                {isCopied ? (
                    <ClipboardCheck className="h-4 w-4 text-green-500" />
                ) : (
                    <Clipboard className="h-4 w-4" />
                )}
            </Button></p>
            
        </div>
    )
}
