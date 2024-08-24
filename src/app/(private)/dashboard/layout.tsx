import React, { ReactNode } from 'react'

export default function DashboardLayout({ children, questions, article }: { children: ReactNode, questions: ReactNode, article: ReactNode }) {
    return (
        <div>
            {children}
            <section className='flex flex-col md:flex-row items-start'>
                {questions}
                {article}
            </section>
        </div>
    )
}
