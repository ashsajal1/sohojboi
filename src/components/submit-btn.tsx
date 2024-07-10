"use client"
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

export const SubmitButton = () => {
    const { pending } = useFormStatus();
    return <>
        <Button disabled={pending} className="mt-2">
            {pending ? 'Submitting...' : 'Submit'}
        </Button>
    </>
}
