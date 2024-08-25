"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";

const referralCodeSchema = z.object({
  referralCode: z.string().min(1, "Referral code is required"),
});

type ReferralCodeFormData = z.infer<typeof referralCodeSchema>;

export default function ReferForm() {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReferralCodeFormData>({
    resolver: zodResolver(referralCodeSchema),
  });

  const onSubmit = async (data: ReferralCodeFormData) => {
    startTransition(() => {
      // Handle form submission
      console.log(data);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <Input
        placeholder="Enter referral code.."
        {...register("referralCode")}
        disabled={isPending}
      />
      {errors.referralCode && (
        <p className="text-red-500">{errors.referralCode.message}</p>
      )}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}