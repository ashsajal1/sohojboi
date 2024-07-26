"use client"
import MarkdownPreview from '@uiw/react-markdown-preview';

export default function Content({ content }: { content: string }) {
    return (
        <MarkdownPreview className='p-4' source={content}>

        </MarkdownPreview>
    )
}
