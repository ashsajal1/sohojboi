"use client"

import { Button } from '@/components/ui/button';
import { Dialog, DialogFooter, DialogHeader, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useState, useTransition } from 'react'
import { setRole } from './actions';
import { Roles } from '@/app/types/globals';

export default function SetRole({ userId, role }: { userId: string, role: Roles }) {
    const [isPending, startTransition] = useTransition();
    const [isShowConfirmDialog, setIsShowConfirmDialog] = useState(false);

    return (
        <>
            <DropdownMenuItem onClick={() => setIsShowConfirmDialog(true)}>Make a moderator</DropdownMenuItem>

            <Dialog open={isShowConfirmDialog} onOpenChange={setIsShowConfirmDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure to make him moderator?</DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant={'ghost'} onClick={() => setIsShowConfirmDialog(false)}>No</Button>
                        <Button onClick={
                            async () => {
                                startTransition(async () => {
                                    await setRole(userId, role)
                                })
                            }
                        } variant={'destructive'}>
                            {isPending ? 'Making moderator...' : 'Yes, confirm'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
