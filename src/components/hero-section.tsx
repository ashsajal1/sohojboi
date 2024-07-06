import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'

export default function HeroSection() {
    return (
        <div className='flex flex-col items-center gap-4 p-6 md:p-24'>
            <h1 className='font-extrabold text-center text-xl md:text-3xl p-4'>Ask question and solve doubt, answer question to practice. Play quiz to enjoy. It&apos;s all about fun!</h1>

            <div className='flex items-center gap-2'>
                <Link href={'/challenge'}>
                    <Button>Challenge Quiz</Button>
                </Link>
                <Link href={'/question'}>
                    <Button variant={'outline'}>Explore Questions</Button>
                </Link>
            </div>
        </div>
    )
}
