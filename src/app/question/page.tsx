import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import QuestionsList from "./questions-list";

export const metadata: Metadata = {
  title: "Explore Questions on Various Topics | Sohojboi",
  description:
    "Discover and engage with a wide range of questions on diverse topics. Join the Sohojboi community to ask, answer, and learn interactively.",
};

export default async function Page() {
  return (
    <>
      <div className="fixed bottom-12 z-20 right-12">
        <Link href="/question/create">
          <Button size={"icon"} variant={"destructive"}>
            <PlusIcon />
          </Button>
        </Link>
      </div>

      <QuestionsList />
    </>
  );
}