import HeroSection from "@/components/hero-section";
import { logger } from "@/logger";

export default async function Home() {
  logger.info("hello world")
  return (
    <>
      <HeroSection />
    </>

  )
}
