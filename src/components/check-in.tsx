"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import confetti from "canvas-confetti";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { Coins } from "lucide-react";

function CheckInConfirmationDialog() {
    const [open, setOpen] = useState(true)

    const triggerConfetti = () => {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) =>
            Math.random() * (max - min) + min;

        const interval = window.setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            });
        }, 250);
    };

    const doCongrass = () => {
        triggerConfetti();
        setTimeout(() => {
            triggerConfetti();
        }, 300)
    }

    useEffect(() => {
        triggerConfetti()
    }, [])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <div className="flex items-center gap-1">
                            +1000  <Coins className='h-5 w-5 mr-2 text-yellow-600' /> Check-In Bonus Added!
                        </div>
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    You have successfully checked in for the day and received your bonus!
                </DialogDescription>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button onClick={doCongrass}>
                            Continue
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default CheckInConfirmationDialog;
