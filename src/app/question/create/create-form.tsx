"use client"
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createQuestion } from "./actions";
import { useFormState, useFormStatus } from "react-dom";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export default function CreateForm() {
    const [errorState, createQuestionAction] = useFormState(createQuestion, null);

    return (
        <div>
            <form action={createQuestionAction}>
                <CardContent>
                    <InputFields />
                    {
                        errorState && <Alert className="mt-2" variant="destructive">
                        <ExclamationTriangleIcon />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {errorState}
                        </AlertDescription>
                    </Alert>
                    }

                </CardContent>
                <CardFooter>
                    <SubmitButton />
                </CardFooter>
            </form>
        </div>
    )
}

const SubmitButton = () => {
    const { pending } = useFormStatus();
    return <>
        <Button>
            {pending ? 'Submitting...' : 'Submit'}
        </Button>
    </>
}

const InputFields = () => {
    const { pending } = useFormStatus();
    return <>
        <Input disabled={pending} name="title" placeholder="Enter title..." />
        <Textarea disabled={pending} name="description" rows={12} placeholder="Enter description..." className="mt-3" />
    </>
}
