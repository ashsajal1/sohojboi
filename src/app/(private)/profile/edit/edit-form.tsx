"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import React, { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createOrUpdateProfile } from './actions';
import { DataTable } from '@/app/(admin)/admin/panel/@questions/data-table';

const editFormSchema = z.object({
    bio: z.string().min(1, { message: 'Bio is required' }),
    address: z.string().min(1, { message: 'Address is required' }),
    grade: z.string().min(1, { message: 'Grade is required' }),
});

export type EditFormSchema = z.infer<typeof editFormSchema>;

export default function EditForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<EditFormSchema>({
        resolver: zodResolver(editFormSchema),
    });

    const [pending, startTransition] = useTransition()

    const onSubmit = (data: EditFormSchema) => {
        startTransition(async () => {
            await createOrUpdateProfile(data)
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
            <div>
                <Textarea disabled={pending} placeholder='Enter bio..' {...register('bio')} />
                {errors.bio && <p className='text-red-500 text-sm'>{errors.bio.message}</p>}
            </div>
            <div>
                <Input disabled={pending} placeholder='Enter address' {...register('address')} />
                {errors.address && <p className='text-red-500 text-sm'>{errors.address.message}</p>}
            </div>
            <div>
                <Input disabled={pending} placeholder='Enter grade' {...register('grade')} />
                {errors.grade && <p className='text-red-500 text-sm'>{errors.grade.message}</p>}
            </div>
            <Button disabled={pending} type='submit'>
                {pending ? "Submitting" : "Submit"}
            </Button>
        </form>
    );
}
