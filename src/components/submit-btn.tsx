"use client"
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import LoaderIcon from "./loader-icon";

export const SubmitButton = () => {
    const { pending } = useFormStatus();
    return <>
        <Button disabled={pending} className="mt-2">
            {pending ? <LoaderIcon /> : 'Submit'}
        </Button>
    </>
}
