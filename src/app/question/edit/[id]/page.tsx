import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import prisma from "@/lib/prisma";
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from "next/navigation";
import DeleteQuestion from "./delete-question";

export default async function Create({ params }: { params: { id: string } }) {
    const questionId = params.id;
    const questionData = await prisma.question.findUnique({
        where: {
            id: questionId
        }
    });

    if((!questionId && questionData)) {
        throw new Error("Please enter a valid question id!")
    }

    const createQuestion = async (formData: FormData) => {
        "use server"
        const title = formData.get("title")
        const description = formData.get("description")

        const updatedQuestion = await prisma.question.update({
            where: {
                id: questionId
            },
            data: {
                questionTitle: title as string,
                questionDescription: description as string,
            }
        })

        // console.log(updatedQuestion);
        redirect(`/question/${questionData?.id}`)
    }
    return (
        <div className="p-4">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center w-full">
                        <CardTitle>Edit question</CardTitle>
                        
                        <DeleteQuestion questionId={questionId} />
                    </div>
                </CardHeader>
                <form action={createQuestion}>
                    <CardContent>
                        <Input defaultValue={questionData?.questionTitle} name="title" placeholder="Enter title..." />
                        <Textarea defaultValue={questionData?.questionDescription} name="description" rows={12} placeholder="Enter description..." className="mt-3" />

                    </CardContent>
                    <CardFooter>
                        <Button>Submit</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
