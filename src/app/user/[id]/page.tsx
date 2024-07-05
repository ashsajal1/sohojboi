import { clerkClient } from "@clerk/nextjs/server";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import QuestionCard from "@/app/question/question-card";
import { Answers } from "@/app/question/[id]/answers";

export default async function Page({ params }: { params: { id: string } }) {
    const user = await clerkClient().users.getUser(params.id)
    // console.log(user)
    const questions = await prisma.question.findMany({
        where: {
            userId: user.id
        }
    })
    const answers = await prisma.answer.findMany({
        where: {
            userId: user.id
        }
    })
    return (
        <>
            <Card className="mt-2">
                <CardHeader>
                    <CardTitle>Profile details of {user.fullName}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <div>
                        <Image className="rounded-ull" width={100} height={100} alt="user image" src={user.imageUrl} />
                        <p>{user.fullName}</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>User stats : </Label>
                        <Badge>Total questions : {questions.length}</Badge>
                        <Badge>Total answers : {answers.length}</Badge>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="questions">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="questions">Asked Questions</TabsTrigger>
                    <TabsTrigger value="answers">Answers</TabsTrigger>
                </TabsList>

                <TabsContent value="questions">
                    {questions.map(question => (
                        <QuestionCard key={question.id} question={question} />
                    ))}
                </TabsContent>
                <TabsContent value="answers">
                    <Answers answers={answers} />
                </TabsContent>
            </Tabs>
        </>
    )
}
