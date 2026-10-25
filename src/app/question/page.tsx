import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import QuestionsList from "./questions-list";

export const metadata: Metadata = {
  title: "Explore Questions on Various Topics | Sohojboi",
  description:
    "Discover and engage with a wide range of questions on diverse topics. Join the Sohojboi community to ask, answer, and learn interactively.",
  alternates: { canonical: "/question" },
};

export default async function Page() {
  return (
    <>
      <div className="fixed bottom-12 z-20 right-12">
        <Link href="/question/create" aria-label="Ask a new question">
          <Button
            size={"icon"}
            variant={"destructive"}
            aria-label="Ask a new question"
          >
            <PlusIcon />
          </Button>
        </Link>
      </div>

      <h1 className="p-4 text-center text-xl font-bold md:text-2xl">
        Explore questions
      </h1>

      <QuestionsList />
    </>
  );
}
