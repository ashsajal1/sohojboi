import React, { ReactNode } from 'react'

export default function AdminLayout({ children, questions, users, summary, article }: { children: ReactNode, questions: ReactNode, users: ReactNode, summary: ReactNode, article: ReactNode }) {
    return (
        <div>
            <div>
                {summary}
            </div>
            {children}
            <section className='flex flex-col md:flex-row items-start'>
                {users}
                {questions}

            </section>

            <div>
                {article}
            </div>

        </div>
    )
}
