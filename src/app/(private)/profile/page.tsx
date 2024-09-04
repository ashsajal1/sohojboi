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
import { clerkClient, currentUser, User } from '@clerk/nextjs/server';
import { getUserWinLoseStats } from "@/lib/db-query";
import { formatDate } from "@/lib/date-format";
import { Winner } from "./winner";
import { calculateWinPercentage } from "./lib/utils";
import ProfileData from "./profile-data";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Answer from "./answer";
import ReferId from "../referral/refer-id";
import { Coins } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge as ProfileBadge } from '@prisma/client'

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
                <CardContent>
                    <section className="flex flex-col gap-2 md:flex-row items-center justify-between">
                        <div>
                            <div className="flex items-center md:items-start flex-col">
                                <Image className="rounded-full" width={100} height={100} alt="user image" src={user?.imageUrl || ''} />

                                <div className="flex items-center gap-1">
                                    <p className="text-center md:text-start">{user?.fullName}</p>
                                    {profile?.badge.includes("VERIFIED") && <Image src="/verified.svg" height={20} width={20} alt="Verified tick" />}
                                </div>

                                <Badge className="w-[150px] text-center mt-2 flex items-center justify-center" variant={'secondary'}>
                                    <Coins className='h-3 w-3 mr-2 text-yellow-600' />
                                    <span>
                                        {profile?.rewardCount} | {(user?.publicMetadata.role as string).toUpperCase()}
                                    </span>
                                </Badge>
                            </div>

                            <ReferId referId={user?.id!} />
                        </div>

                        <Separator className="md:hidden" />

                        <div className="flex flex-col gap-2">
                            <Label className="text-center md:text-start">User stats : </Label>
                            <Badge>Total questions : {questions.length}</Badge>
                            <Badge>Total answers : {answers.length}</Badge>
                            <Badge>Challenge win percentage : {calculateWinPercentage(challangeStats.wins, challangeStats.losses)}%</Badge>
                        </div>
                    </section>

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