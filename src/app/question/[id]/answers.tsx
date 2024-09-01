import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardFooter, CardHeader, } from "@/components/ui/card";
import Upvote from "./upvote";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { Question, type Answer } from "@prisma/client";
import { chekcIsAnswerUpvoted } from "@/lib/utils";
import ProfileImgCard from "@/components/profile-img-card";
import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import DeleteAnswer from "./delete-answer";
import EditAnswer from "./edit-answer";
import ReactMarkdown from 'react-markdown';
import { Separator } from "@/components/ui/separator";
import Comment from "./comment/comment";
import CommentSection from "./comment/comment-section";
import { BookOpenCheck } from "lucide-react";
import MarkSolution from "./mark-solution";
import { ArrowRightIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import AnimatedShinyText from "@/components/magicui/animated-shiny-text";

interface AnswersProps {
    answers: Answer[];
    question: Question | null
}

export const Answers = async ({ answers, question }: AnswersProps) => {
    const user = await currentUser();
    if (answers.length === 0) {
        return null;
    }

    return <div className="flex flex-col gap-2 w-full">
        <Badge variant={'secondary'} className="mb-4">Community answers :</Badge>
        {answers.map(answer => (
            <Answer question={question} key={answer.id} answer={answer} />
        ))}
    </div>
}

/**
 * Displays a single answer to a question.
 * 
 * @param {Object} answer The answer to display.
 * @param {Object} question The question that the answer belongs to.
 * @returns A JSX element representing the answer.
 */
const Answer = async ({ answer, question }: { answer: Answer, question: Question | null }) => {
    /**
     * Get the user who answered the question
     */
    let answeredUser;
    /**
     * Get the current user
     */
    let currentUser;
    /**
     * The profile image URL for the answered user
     */
    let profileImageSrc;
    /**
     * Get the current user
     */
    const user = await auth();
    /**
     * Check if the current user has upvoted the answer
     */
    let isUpvotedAnswer = await chekcIsAnswerUpvoted(user.userId || '', answer.id);

    try {
        /**
         * Get the user who answered the question
         */
        answeredUser = await clerkClient().users.getUser(answer.userId);
        /**
         * Get the profile image URL for the answered user
         */
        profileImageSrc = answeredUser.imageUrl;
        /**
         * Get the current user
         */
        currentUser = await auth();
    } catch (error: any) {
        // throw new Error(error.message)
    }

    return <Card>
        <CardHeader>
            {/* If the answer is the solution, display a badge indicating as such */}

            {answer.isSolution && <div className="z-10 flex items-center justify-start">
                <div
                    className={cn(
                        "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800",
                    )}
                >
                    <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                        <span>✅ Solution</span>

                    </AnimatedShinyText>
                </div>
            </div>}
            <div className="flex justify-between items-start">
                <CardDescription>
                    <ReactMarkdown>{answer.answer}</ReactMarkdown>
                </CardDescription>
                {
                    /**
                     * If the current user is the same as the answered user, display a dropdown menu with edit and delete options
                     */
                    user.userId === answer?.userId && <HoverCard>
                        <HoverCardTrigger>
                            <Button size='sm' variant='ghost'><DotsHorizontalIcon /></Button>
                        </HoverCardTrigger>
                        <HoverCardContent>
                            <div className="flex items-center gap-2 justify-between">
                                <EditAnswer answerId={answer.id} answerText={answer.answer} questionId={question?.id || ''} />
                                <DeleteAnswer questionId={answer.questionId} answerId={answer.id} />
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                }
            </div>

        </CardHeader>

        <CardFooter>
            <section className="flex flex-col w-full">
                <div className="flex items-center justify-between w-full">
                    <ProfileImgCard type={"answer"} userId={answer.userId} createdAt={answer.createdAt || new Date()} />

                    <div className="flex items-center gap-2">
                        {
                            /**
                             * If the answer is not the solution, display a button to mark it as the solution
                             */
                            !answer.isSolution && <MarkSolution answerId={answer.id} questionId={question?.id!} />
                        }
                        <Upvote isUpvotedAnswer={isUpvotedAnswer || false} question={question} userId={currentUser?.userId || ''} answer={answer} />
                    </div>
                </div>

                <CommentSection answer={answer} />
            </section>

        </CardFooter>
    </Card>
}
