import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return <div className="p-4 grid place-items-center">
        <SignIn />
    </div>;
}