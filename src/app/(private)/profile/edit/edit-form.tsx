"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import React, { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createOrUpdateProfile } from './actions';

const editFormSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    bio: z.string().min(1, { message: 'Bio is required' }),
    address: z.string().min(1, { message: 'Address is required' }),
    grade: z.string().min(1, { message: 'Grade is required' }),
});

export type EditFormSchema = z.infer<typeof editFormSchema>;
export interface UserDataProps {
    name: string,
    bio: string,
    address: string,
    grade: number,
    id: string,
}
export default function EditForm({ userData }: { userData: UserDataProps }) {
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
            await createOrUpdateProfile(data, userData.id)
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
            <div>
                <Input defaultValue={userData.name} disabled={pending} placeholder='Enter name..' {...register('name')} />
                {errors.bio && <p className='text-red-500 text-sm'>{errors.bio.message}</p>}
            </div>
            <div>
                <Textarea defaultValue={userData.bio} disabled={pending} placeholder='Enter bio..' {...register('bio')} />
                {errors.bio && <p className='text-red-500 text-sm'>{errors.bio.message}</p>}
            </div>
            <div>
                <Input defaultValue={userData.address} disabled={pending} placeholder='Enter address' {...register('address')} />
                {errors.address && <p className='text-red-500 text-sm'>{errors.address.message}</p>}
            </div>
            <div>
                <Input defaultValue={userData.grade} disabled={pending} placeholder='Enter grade' {...register('grade')} />
                {errors.grade && <p className='text-red-500 text-sm'>{errors.grade.message}</p>}
            </div>
            <Button disabled={pending} type='submit'>
                {pending ? "Submitting" : "Submit"}
            </Button>
        </form>
    );
}
