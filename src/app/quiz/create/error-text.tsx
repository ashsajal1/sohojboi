import React from 'react'

export default function ErrorText({ text }: { text: string }) {
    return (
        <p className='text-sm text-red-800'>{text}</p>
    )
}
