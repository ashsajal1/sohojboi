import { Suspense } from "react";
import type { Metadata } from "next";
import HeroSection from "@/components/hero-section";
import { currentUser } from "@clerk/nextjs/server";
import doCheckIn from "./_actions/doCheckIn";
import CheckInConfirmationDialog from "@/components/check-in";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Auth + DB work is isolated in its own Suspense boundary so the hero paints
 * in the first flush. Previously this `await` blocked the whole page, so the
 * route skeleton was the first paint and then got replaced (CLS 0.48).
 */
async function DailyCheckIn() {
  const user = await currentUser();
  if (!user) return null;
  const checkInStatus = await doCheckIn(user.id);
  return checkInStatus ? <CheckInConfirmationDialog /> : null;
}

export default function Home() {
  return (
    <>
      <Suspense fallback={null}>
        <DailyCheckIn />
      </Suspense>
      <HeroSection />
    </>
  )
}
