import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import QuestionCard from "@/app/question/question-card";
import { Answers } from "@/app/question/[id]/answers";
import { clerkClient, currentUser, User } from '@clerk/nextjs/server';
import { Competition } from "@prisma/client";
import { getUserWinLoseStats } from "@/lib/db-query";
import { formatDate } from "@/lib/date-format";
import { Winner } from "./winner";
import { Names } from "./names";
import ProfileImgCard from "@/components/profile-img-card";
import { calculateWinPercentage, getWinnerLoser } from "./lib/utils";

export async function generateMetadata({ searchParams }: { searchParams: { id: string } }) {
    let user: User | null;

    if (!searchParams.id) {
        user = await currentUser();
    } else {
        user = await clerkClient().users.getUser(searchParams.id)
    }
    return {
        title: `Profile of ${user?.fullName}`,
        description: `View profile of ${user?.fullName}`,
        tags: [`${user?.fullName}`, `Profile of ${user?.fullName}`, `Sohojboi profile of ${user?.fullName}`]
    }
}

export default async function Page({ searchParams }: { searchParams: { id: string } }) {

    let user: User | null;

    if (!searchParams.id) {
        user = await currentUser();
    } else {
        user = await clerkClient().users.getUser(searchParams.id)
    }

    const challangeStats = await getUserWinLoseStats(user?.id || '')
    const questions = await prisma.question.findMany({
        where: {
            userId: user?.id
        },
        orderBy: {
            updatedAt: 'desc'
        }
    })
    const answers = await prisma.answer.findMany({
        where: {
            userId: user?.id
        },
        orderBy: {
            updatedAt: 'desc'
        }
    })

    const challenges = await prisma.competition.findMany({
        where: {
            OR: [
                { challengerId: user?.id },
                { challengeeId: user?.id },
            ],
            status: "completed",
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 10
    })

    return (
        <>
            <Card className="mt-2">
                <CardHeader>
                    <CardTitle>Profile details of {user?.fullName}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <div>
                        <Image className="rounded-ull" width={100} height={100} alt="user image" src={user?.imageUrl || ''} />
                        <p>{user?.fullName}</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>User stats : </Label>
                        <Badge>Total questions : {questions.length}</Badge>
                        <Badge>Total answers : {answers.length}</Badge>
                        <Badge>Challenge win percentage : {calculateWinPercentage(challangeStats.wins, challangeStats.losses)}%</Badge>
                    </div>
                </CardContent>
            </Card>

            <Tabs className="mt-2" defaultValue="questions">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="questions">Asked Questions</TabsTrigger>
                    <TabsTrigger value="answers">Answers</TabsTrigger>
                    <TabsTrigger value="challenges">Challenges</TabsTrigger>
                </TabsList>

                <TabsContent className="flex flex-col gap-2" value="questions">
                    {questions.map(question => (
                        <QuestionCard key={question.id} question={question} />
                    ))}
                </TabsContent>
                <TabsContent value="answers">
                    {questions.map(question => (
                        <Answers key={question.id} question={question} answers={answers.filter(answer => answer.questionId === question.id)} />
                    ))}
                </TabsContent>
                <TabsContent className="grid md:grid-cols-2 gap-2" value="challenges">
                    {challenges.map(challenge => (
                        <Card key={challenge.id}>
                            <CardHeader>
                                <Winner
                                    challengerId={challenge.challengerId}
                                    challengeeId={challenge.challengeeId}
                                    userId={user?.id || ''}
                                    challengerScore={challenge.challengerScore}
                                    challengeeScore={challenge.challengeeScore || 0}
                                />
                                <CardTitle>
                                    Competition between: {challenge.title}
                                </CardTitle>
                                <CardDescription>{formatDate(challenge.createdAt)}</CardDescription>
                            </CardHeader>

                            <ProfileData challenge={challenge} />
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>
        </>
    )
}

const ProfileData = ({ challenge }: { challenge: Competition }) => {
    const { winnerId, loserId } = getWinnerLoser(challenge)
    const isDraw = challenge.challengerScore === challenge.challengeeScore;

    return <CardContent>

        <Names challenge={challenge} />
        <div className="flex items-center justify-between">
            <ProfileImgCard
                type={"challengeResult"}
                userId={challenge.challengerId}
                challengeStatus={isDraw ? 'draw' : (challenge.challengerId === winnerId ? 'winner' : 'loser')}
            />
            <ProfileImgCard
                type={"challengeResult"}
                userId={challenge.challengeeId}
                challengeStatus={isDraw ? 'draw' : (challenge.challengeeId === winnerId ? 'winner' : 'loser')}
            />
        </div>

    </CardContent>
}

