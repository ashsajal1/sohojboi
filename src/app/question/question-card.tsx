import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Question } from "@prisma/client";
import ProfileImgCard from "@/components/profile-img-card";
import QuestionInteractions from "./question-interactions";
import BlurFade from "@/components/magicui/blur-fade";

interface QuestionProps {
  question: Question;
}

export default function QuestionCard({ question }: QuestionProps) {
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

          <QuestionInteractions question={question} />
        </CardFooter>
      </BlurFade>
    </Card>
  );
}