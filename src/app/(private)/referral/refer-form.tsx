"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const referralCodeSchema = z.object({
  referralCode: z.string().min(1, "Referral code is required"),
});

type ReferralCodeFormData = z.infer<typeof referralCodeSchema>;

export default function ReferForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReferralCodeFormData>({
    resolver: zodResolver(referralCodeSchema),
  });

  const onSubmit = (data: ReferralCodeFormData) => {
    // Handle form submission
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <Input
        placeholder="Enter referral code.."
        {...register("referralCode")}
      />
      {errors.referralCode && (
          <p className="text-red-500">{errors.referralCode.message}</p>
      )}
      <Button type="submit">Submit</Button>
    </form>
  );
}