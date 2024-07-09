import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import prisma from "@/lib/prisma";
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function Create({ params }: { params: { id: string } }) {
    const questionId = params.id;
    const user = await currentUser();
    const questionData = await prisma.question.findUnique({
        where: {
            id: questionId
        }
    });

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
                    <CardTitle>Edit question</CardTitle>
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
