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
        const scalar = 2;
        const unicorn = confetti.shapeFromText({ text: "💖", scalar });
     
        const defaults = {
          spread: 360,
          ticks: 60,
          gravity: 0,
          decay: 0.96,
          startVelocity: 20,
          shapes: [unicorn],
          scalar,
        };
     
        const shoot = () => {
          confetti({
            ...defaults,
            particleCount: 30,
          });
     
          confetti({
            ...defaults,
            particleCount: 5,
          });
     
          confetti({
            ...defaults,
            particleCount: 15,
            scalar: scalar / 2,
            shapes: ["circle"],
          });
        };
     
        setTimeout(shoot, 0);
        setTimeout(shoot, 100);
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
