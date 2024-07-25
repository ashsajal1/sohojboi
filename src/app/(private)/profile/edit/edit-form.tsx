"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const editFormSchema = z.object({
  bio: z.string().min(1, { message: 'Bio is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
  grade: z.string().min(1, { message: 'Grade is required' }),
});

type EditFormSchema = z.infer<typeof editFormSchema>;

export default function EditForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditFormSchema>({
    resolver: zodResolver(editFormSchema),
  });

  const onSubmit = (data: EditFormSchema) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
      <div>
        <Textarea placeholder='Enter bio..' {...register('bio')} />
        {errors.bio && <p className='text-red-500 text-sm'>{errors.bio.message}</p>}
      </div>
      <div>
        <Input placeholder='Enter address' {...register('address')} />
        {errors.address && <p className='text-red-500 text-sm'>{errors.address.message}</p>}
      </div>
      <div>
        <Input placeholder='Enter grade' {...register('grade')} />
        {errors.grade && <p className='text-red-500 text-sm'>{errors.grade.message}</p>}
      </div>
      <Button type='submit'>Submit</Button>
    </form>
  );
}
