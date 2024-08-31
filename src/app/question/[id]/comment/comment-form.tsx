"use client"
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CommentFormData, commentSchema } from './type'
import { useTransition } from 'react'
import { createComment } from './actions'
import LoaderIcon from '@/components/loader-icon'

export default function CommentForm({answerId}: {answerId: string}) {
    const { register, handleSubmit, formState: { errors } } = useForm<CommentFormData>({
        resolver: zodResolver(commentSchema),
    })

    const [pending, startTransition] = useTransition()

    const onSubmit: SubmitHandler<CommentFormData> = async (data) => {
        await startTransition(async () => {
            await createComment(data, answerId)
        })
    }

    return (
        <form className="flex flex-col items-start gap-2" onSubmit={handleSubmit(onSubmit)}>
            <Textarea disabled={pending} {...register('content')} placeholder="Enter your comment" />
            {errors.content && <span className="text-red-600 text-sm">{errors.content.message}</span>}
            <Button size={pending ? 'icon' : 'default'} disabled={pending} type="submit">
                {pending ? <LoaderIcon /> : "Submit"}
            </Button>
        </form>
    )
}