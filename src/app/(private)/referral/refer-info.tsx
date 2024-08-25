"use client";

import ShareBtn from "@/components/share-btn";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { User } from "@clerk/nextjs/server";
import { Refer } from "@prisma/client";
import { Clipboard, ClipboardCheck } from "lucide-react";
import { useState } from "react";

export default function ReferInfo({ user, refer }: { user: User; refer: Refer[] }) {
  const [isCopied, setIsCopied] = useState(false);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(user?.id);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <Card className="mt-3">
      <CardHeader>
        <div className="flex items-center gap-2">
          <p>Your referral code: <code>{user?.id}</code></p>
          <button
            className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
            onClick={copyReferralCode}
          >
            {isCopied ? (
              <ClipboardCheck className="h-4 w-4 text-green-500" />
            ) : (
              <Clipboard className="h-4 w-4" />
            )}
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <p>Your referral count: <code>{refer.length}</code></p>
      </CardContent>
      <CardFooter>
        <ShareBtn
          title={`Use my refer code: ${user?.id} and get 100 points bonus.`}
          description={`Use my refer code: ${user?.id} and get 100 points bonus.`}
        />
      </CardFooter>
    </Card>
  );
}