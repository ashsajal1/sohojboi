import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from '@/components/ui/dialog'
import { TrashIcon } from '@radix-ui/react-icons'
import React from 'react'

export default function DeleteArticleBtn() {
    return (
        <Dialog>
            <DialogTrigger>
                <Button type='button' variant='destructive'>
                    <TrashIcon className='mr-1' />
                    Delete Article
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>Are you sure to delete the article?</DialogHeader>
                <DialogFooter>
                    <Button variant='ghost'>No</Button>
                    <Button variant='destructive'>Yes, Delete!</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
