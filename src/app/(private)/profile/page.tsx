import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

export default async function Page({ searchParams }: { searchParams: { id: string } }) {
    let user: User | null;

    if(!searchParams.id) {
        user = await currentUser();
    } else {
        user = await clerkClient().users.getUser(searchParams.id)
    }

    const challangeStats = await getUserWinLoseStats(user?.id || '')

    // console.log(user)
    const questions = await prisma.question.findMany({
        where: {
            userId: user?.id
        }
    })
    const answers = await prisma.answer.findMany({
        where: {
            userId: user?.id
        }
    })

    const challenges = await prisma.competition.findMany({
        where: {
            OR: [
                { challengerId: user?.id },
                { challengeeId: user?.id },
            ],
            status: "completed"
        },
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

                <TabsContent value="questions">
                    {questions.map(question => (
                        <QuestionCard key={question.id} question={question} />
                    ))}
                </TabsContent>
                <TabsContent value="answers">
                    <Answers answers={answers} />
                </TabsContent>
                <TabsContent value="challenges">
                    {challenges.map(challenge => (
                        <Card className="mb-2" key={challenge.id}>
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
                            </CardHeader>
                            <CardContent>
                                <Names challenge={challenge} />
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>
        </>
    )
}

const Winner = async ({ challengerId, challengeeId, userId, challengerScore, challengeeScore }: { challengerId: string, challengeeId: string, userId: string, challengerScore: number, challengeeScore: number }) => {

    let resultText = '';
    let badgeVariant: 'secondary' | 'destructive' = 'secondary';

    const challenger = await clerkClient().users.getUser(challengerId);
    const challengee = await clerkClient().users.getUser(challengeeId);

    if (challengerScore === challengeeScore) {
        resultText = 'It\'s a draw';
    } else {
        const winnerId = challengerScore > challengeeScore ? challengerId : challengeeId;
        const winnerName = winnerId === challengerId ? challenger.fullName : challengee.fullName;
        const loserName = winnerId === challengerId ? challengee.fullName : challenger.fullName;
        const userWon = winnerId === userId;

        if (userWon) {
            resultText = `${winnerName} won against ${loserName}`;
            badgeVariant = 'secondary';
        } else {
            resultText = `${loserName} lost against ${winnerName}`;
            badgeVariant = 'destructive';
        }
    }

    return (
        <Badge variant={badgeVariant}>
            {resultText}
        </Badge>
    );
}


const Names = async ({ challenge }: { challenge: Competition }) => {
    const challenger = (await clerkClient().users.getUser(challenge.challengerId)).lastName;
    const challengee = (await clerkClient().users.getUser(challenge.challengeeId)).lastName;
    return <>
        <p><strong>{challenger}&apos;s Score:</strong> {challenge.challengerScore}</p>
        <p><strong>{challengee}&apos;s Score:</strong> {challenge.challengeeScore}</p>
    </>
}

function calculateWinPercentage(wins: number, losses: number): number {
    const totalGames = wins + losses;
    if (totalGames === 0) return 0; // Avoid division by zero
    return (wins / totalGames) * 100;
}