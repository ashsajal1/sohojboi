"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createAnswer } from "./actions";
import { useFormState, useFormStatus } from "react-dom";
import { Question } from "@prisma/client"

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { ZodFormattedError } from 'zod';
import { SubmitButton } from "@/components/submit-btn";

type ErrorState = ZodFormattedError<{ answerText: string; }, string> | { error: string } | null

export default function AnswerForm({ question }: { question: Question | null}) {
    const [errorState, createAnswerAction] = useFormState(createAnswer, null);

    const errorMessage: ErrorState = errorState || {} as ErrorState;

    return (
        <div>
            <form action={createAnswerAction}>

                {
                    errorState && <Alert className="mb-2" variant="destructive">
                        <ExclamationTriangleIcon />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {renderErrorState(errorMessage)}
                        </AlertDescription>
                    </Alert>
                }
                <InputFields />
                
                <Input hidden={true} className="hidden" value={question?.id} name="questionId" />

                <SubmitButton />
            </form>
        </div>
    )
}

const InputFields = () => {
    const { pending } = useFormStatus();
    return <>
        <Textarea disabled={pending} name="answerText" rows={6} placeholder="Enter your asnwer..."></Textarea>
    </>
}

const renderErrorState = (errorState: ErrorState) => {
    if (errorState !== null) {
        if ('error' in errorState) {
            return <div>{errorState.error}</div>;
        }

        return (
            <>
                {errorState.answerText && errorState.answerText._errors.map((error: any, index: any) => (
                    <div key={index}>{error}</div>
                ))}
            </>
        );
    }
};


