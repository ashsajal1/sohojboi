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
import ProfileData from "./profile-data";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Answer from "./answer";

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
    const currentActiveUser = await currentUser();
    let user: User | null;

    if (!searchParams.id) {
        user = currentActiveUser;
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
    });

    const profile = await prisma.profile.findFirst({
        where: {
            clerkUserId: searchParams.id as string,
        }
    })

    return (
        <>
            <Card className="mt-2">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Profile details of {user?.fullName}</CardTitle>

                            {profile?.bio && <CardDescription>{profile.bio}</CardDescription>}
                        </div>

                        {user?.id === currentActiveUser?.id && <Link href={'/profile/edit'}>
                            <Button size={'sm'} variant={'outline'}>Edit profile</Button></Link>}
                    </div>
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
                    {questions.length === 0 && <h3 className="text-center p-4 font-bold text-xl">No questions found!</h3>}
                    {questions.map(question => (
                        <QuestionCard key={question.id} question={question} />
                    ))}
                </TabsContent>
                <TabsContent value="answers">
                    {answers.length === 0 && <h3 className="text-center p-4 font-bold text-xl">No answers found!</h3>}

                    {answers.map(answer => (
                        <Answer key={answer.id} answer={answer}></Answer>
                    ))}
                </TabsContent>
                <TabsContent className="grid md:grid-cols-2 gap-2" value="challenges">
                    {challenges.length === 0 && <h3 className="text-center p-4 font-bold text-xl">No challenges found!</h3>}
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