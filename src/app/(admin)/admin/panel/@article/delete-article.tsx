"use client"

import { Button } from '@/components/ui/button';
import { Dialog, DialogFooter, DialogHeader, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useTransition } from 'react'
import { deleteArticle } from './actions';

export default function DeleteArticle({ questionId, open, setOpen }: { questionId: string, open: boolean, setOpen: (value: boolean) => void }) {
    const [isPending, startTransition] = useTransition();

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure to delete the article?</DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                        <Button disabled={isPending} variant={'ghost'} onClick={() => setOpen(false)}>No</Button>
                        <Button disabled={isPending} onClick={
                            async () => {
                                startTransition(async () => {
                                    await deleteArticle(questionId)
                                })
                            }
                        } variant={'destructive'}>
                            {isPending ? 'Deleting...' : 'Yes, delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
