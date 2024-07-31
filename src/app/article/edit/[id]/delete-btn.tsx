import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from '@/components/ui/dialog'
import { Article } from '@prisma/client'
import { TrashIcon } from '@radix-ui/react-icons'
import React, { useTransition } from 'react'
import { deleteArticle } from './actions'

export default function DeleteArticleBtn({ article }: { article: Article }) {
    const [pending, startTransiton] = useTransition();

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
                    <Button disabled={pending} variant='ghost'>No</Button>
                    <Button disabled={pending} onClick={async () => {
                        await startTransiton(async () => {
                            await deleteArticle(article)
                        })
                    }} variant='destructive'>{pending ? 'Deleting' : 'Yes, Delete!'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
