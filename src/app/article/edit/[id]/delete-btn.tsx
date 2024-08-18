import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog'
import { Article } from '@prisma/client'
import { TrashIcon } from '@radix-ui/react-icons'
import React, { useTransition } from 'react'
import { deleteArticle } from './actions'
import LoaderIcon from '@/components/loader-icon'

export default function DeleteArticleBtn({ article }: { article: Article }) {
    const [pending, startTransiton] = useTransition();

    return (
        <Dialog>
            <DialogTrigger>
                <Button type='button' variant='destructive'>
                    <TrashIcon className='mr-1' />
                    Delete
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure to delete the article?</DialogTitle>
                    <DialogDescription>This action won&apos;t be undone.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button disabled={pending} variant='ghost'>No</Button>
                    </DialogClose>
                    <Button disabled={pending} onClick={async () => {
                        await startTransiton(async () => {
                            await deleteArticle(article)
                        })
                    }} variant='destructive'>{pending ? <><LoaderIcon /> Deleting</> : 'Yes, Delete!'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
