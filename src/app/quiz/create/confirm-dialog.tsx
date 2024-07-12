import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogFooter, DialogHeader, DialogTitle, DialogContent } from '@/components/ui/dialog';
import { QuestionFormData } from "./create-form";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { createChallengeQuestion } from './actions';
import { useTransition } from 'react';

export default function ConfirmDialog({ isDialogOpen, formData }: { isDialogOpen: boolean, formData: QuestionFormData }) {
    const [isPending, startTransition] = useTransition();
    const options = formData.options.map((option) => {
        return {
            content: option.content || '',
            isCorrect: false,
        };
    });
    return (
        <Dialog open={isDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm the data</DialogTitle>
                </DialogHeader>

                <div>
                    <p className='font-extralight text-lg'>Question : {formData.content}</p>
                    <p>Correct option : <span><Badge variant={'outline'}>{formData.correctOption}</Badge></span></p>
                    <Separator className='my-2' />
                    <div>
                        <p> Wrong options :</p>
                        <div className='flex flex-col gap-2'>
                            {options.map((option, index) => (
                                <Badge variant={'secondary'} key={index}>
                                    {option.content!}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <p className='mt-2'>Topic : <Badge variant={'secondary'}>{formData.topic}</Badge></p>

                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant={'ghost'}>Cancle</Button>
                    </DialogClose>
                    <Button onClick={async () => {
                        startTransition(async () => {
                            await createChallengeQuestion(formData)
                        })
                    }}>
                        {isPending? 'Creating...' :'Confirm'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
