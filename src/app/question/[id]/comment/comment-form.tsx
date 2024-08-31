"use client"
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export default function CommentForm() {
  const { register, handleSubmit } = useForm()

  const onSubmit = (data: any) => {
    console.log(data)
  }

  return (
    <form className="flex items-start gap-2" onSubmit={handleSubmit(onSubmit)}>
      <Textarea {...register('content')} />
      <Button type="submit">Submit</Button>
    </form>
  )
}

