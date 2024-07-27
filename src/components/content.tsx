"use client"
import MarkdownPreview from '@uiw/react-markdown-preview';
import rehypeSanitize from "rehype-sanitize";
const rehypePlugins = [rehypeSanitize];
import { useTheme } from "next-themes"

export default function Content({ content }: { content: string }) {
    const { theme } = useTheme();
    return (
        <MarkdownPreview
            wrapperElement={{
                "data-color-mode": theme as "light" | "dark" | undefined
            }}
            className='p-4'
            rehypePlugins={rehypePlugins}
            source={content}>

        </MarkdownPreview>
    )
}
