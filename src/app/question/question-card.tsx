"use client";

import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import UpvoteBtn from "./upvote-btn";
import { Question } from "@prisma/client";
import ProfileImgCard from "@/components/profile-img-card";
import { CornerDownRightIcon } from "lucide-react";
import BlurFade from "@/components/magicui/blur-fade";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { chekcIsQuestionUpvoted } from "../_actions/actions";

interface QuestionProps {
  question: Question;
}

export default function QuestionCard({ question }: QuestionProps) {
  const { user } = useUser();
  const actorId = user?.id || "";
  const [isUpvotedQuestion, setIsUpvotedQuestion] = useState<boolean>(false);

  // Fetch upvote status
  useEffect(() => {
    const fetchUpvoteStatus = async () => {
      const isUpvoted = await chekcIsQuestionUpvoted(actorId, question.id);
      setIsUpvotedQuestion(isUpvoted);
    };

    if (actorId) {
      fetchUpvoteStatus();
    }
  }, [actorId, question.id]);

  return (
    <Card className="z-10">
      <BlurFade delay={0.25} inView>
        <CardHeader>
          <CardTitle>{question.content}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {question.description.slice(0, 120)}...
          </p>
          <div className="text-sm text-muted-foreground flex items-center gap-2"></div>
        </CardHeader>

        <CardFooter className="flex items-center justify-between">
          <ProfileImgCard
            type="question"
            createdAt={question.createdAt}
            userId={question.userId}
          />

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
              actorId={actorId}
            />
          </div>
        </CardFooter>
      </BlurFade>
    </Card>
  );
}