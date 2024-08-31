import { z } from 'zod'

// Define the Zod schema
export const commentSchema = z.object({
  content: z.string().min(1, 'Content is required').max(500, 'Content must be less than 500 characters'),
})

export type CommentFormData = z.infer<typeof commentSchema>