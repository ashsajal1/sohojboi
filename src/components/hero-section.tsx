import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { MixIcon, QuestionMarkIcon, ShuffleIcon } from '@radix-ui/react-icons'

export default function HeroSection() {
    return (
        <div className='flex flex-col items-center gap-4 p-6 md:p-24'>
            <h1 className='font-extrabold text-center text-xl md:text-3xl p-4'>Ask question and solve doubt, answer question to practice. Play quiz to enjoy. It&apos;s all about fun!</h1>

            <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-2'>
                    <Link href={'/challenge'}>
                        <Button variant={'outline'}>
                            <MixIcon className='mr-2' />
                            Challenge Quiz
                        </Button>
                    </Link>
                    <Link href={'/question'}>
                        <Button variant={'outline'}>
                            <ShuffleIcon className='mr-2' />
                            Explore Questions</Button>
                    </Link>
                </div>

                <Link className='w-full' href={'/question/create'}>
                    <Button className='w-full' variant={'default'}>
                        Ask Question
                        <QuestionMarkIcon />
                    </Button>

                </Link>
            </div>
        </div>
    )
}
