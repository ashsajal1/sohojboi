"use client"
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

// Define the Zod schema
const commentSchema = z.object({
  content: z.string().min(1, 'Content is required').max(500, 'Content must be less than 500 characters'),
})

type CommentFormData = z.infer<typeof commentSchema>

export default function CommentForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  })

  const onSubmit: SubmitHandler<CommentFormData> = (data) => {
    console.log(data)
  }

  return (
    <form className="flex flex-col items-start gap-2" onSubmit={handleSubmit(onSubmit)}>
      <Textarea {...register('content')} placeholder="Enter your comment" />
      {errors.content && <span className="text-red-600 text-sm">{errors.content.message}</span>}
      <Button type="submit">Submit</Button>
    </form>
  )
}