"use client"
import MarkdownPreview from '@uiw/react-markdown-preview';
import rehypeSanitize from "rehype-sanitize";
const rehypePlugins = [rehypeSanitize];

export default function Content({ content }: { content: string }) {
    return (
        <MarkdownPreview
            wrapperElement={{
                "data-color-mode": "light"
            }}
            className='p-4'
            rehypePlugins={rehypePlugins}
            source={content}>

        </MarkdownPreview>
    )
}
