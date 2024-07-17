import prisma from '@/lib/prisma'
import { EyeOpenIcon } from '@radix-ui/react-icons'
import React from 'react'

export default async function Views({ articleId }: { articleId: string }) {
    const viewCount = await prisma.view.aggregate({
        _sum: {
            count: true,
        },
        where: {
            articleId: {
                in: [articleId]
            }
        }
    })

    return (
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <EyeOpenIcon />
            {viewCount._sum.count || 0}
        </div>
    )
}
