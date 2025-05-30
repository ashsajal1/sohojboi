"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CornerDownRightIcon } from "lucide-react";
import { Question } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { chekcIsQuestionUpvoted } from "../_actions/actions";
import UpvoteBtn from "./upvote-btn";

interface QuestionInteractionsProps {
  question: Question;
}

export default function QuestionInteractions({ question }: QuestionInteractionsProps) {
  const { user } = useUser();
  const userId = user?.id || "";
  const [isUpvotedQuestion, setIsUpvotedQuestion] = useState<boolean>(false);

  useEffect(() => {
    const fetchUpvoteStatus = async () => {
      const isUpvoted = await chekcIsQuestionUpvoted(userId, question.id);
      setIsUpvotedQuestion(isUpvoted);
    };

    if (userId) {
      fetchUpvoteStatus();
    }
  }, [userId, question.id]);

  return (
    <div className="flex items-center gap-2">
      <Link href={`/question/${question.id}`}>
        <Button variant={"link"} size={"sm"}>
          <CornerDownRightIcon className="mr-2 h-4 w-4" />
          Answer
        </Button>
      </Link>
      <UpvoteBtn
        isUpvotedQuestion={isUpvotedQuestion}
        question={question}
        actorId={userId}
      />
    </div>
  );
} 