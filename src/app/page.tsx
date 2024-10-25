import HeroSection from "@/components/hero-section";
import { currentUser } from "@clerk/nextjs/server";
import doCheckIn from "./_actions/doCheckIn";
import CheckInConfirmationDialog from "@/components/check-in";

export default async function Home() {
  const user = await currentUser();
  let checkInStatus;
  if (user) {
    checkInStatus = await doCheckIn(user.id);
    console.log("Check-in status:", checkInStatus);
    if(checkInStatus) {
      console.log("Checked in added bonus.")
    }
  }
  return (
    <>
    {checkInStatus && <CheckInConfirmationDialog />}
      <HeroSection />
    </>

  )
}
