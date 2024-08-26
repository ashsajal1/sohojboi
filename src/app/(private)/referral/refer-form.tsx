"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { claimReferBonus } from "./actions";
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import LoaderIcon from "@/components/loader-icon";

const referralCodeSchema = z.object({
  referralCode: z.string().min(1, "Referral code is required"),
});

type ReferralCodeFormData = z.infer<typeof referralCodeSchema>;

export default function ReferForm({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReferralCodeFormData>({
    resolver: zodResolver(referralCodeSchema),
  });

  const onSubmit = async (data: ReferralCodeFormData) => {
    if (data.referralCode === userId) {
      await toast("You cannot refer yourself!", {
        description: "Use other's refer id.",
        action: {
          label: "Got it",
          onClick: () => {},
        },
      });

      return;
    };

    await startTransition(async () => {
      // Handle form submission
      const res = await claimReferBonus(data.referralCode);
      if(res?.error) {
        toast.error(res.error)
        return;
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
       <Toaster />
      <Input
        placeholder="Enter referral code.."
        {...register("referralCode")}
        disabled={isPending}
      />
      {errors.referralCode && (
        <p className="text-red-500">{errors.referralCode.message}</p>
      )}
      <Button type="submit" disabled={isPending}>
        {isPending ? <><LoaderIcon /> Submitting</> : "Submit"}
      </Button>
    </form>
  );
}