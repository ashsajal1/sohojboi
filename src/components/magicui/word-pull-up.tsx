import { cn } from "@/lib/utils";

interface WordPullUpProps {
  words: string;
  /** seconds each word waits after the previous one (CSS-driven, no JS) */
  delayMultiple?: number;
  className?: string;
}

/**
 * Renders the headline server-side and animates it with CSS.
 *
 * The previous framer-motion version SSR'd `style="opacity:0"`, so the page's
 * largest text stayed invisible until hydration — the main driver behind the
 * 5.1 s LCP / 11.9 s Speed Index.
 */
export default function WordPullUp({
  words,
  delayMultiple = 0.06,
  className,
}: WordPullUpProps) {
  const wordList = words.split(" ");
  return (
    <h1
      className={cn(
        "font-display text-center text-4xl font-bold leading-[5rem] tracking-[-0.02em] drop-shadow-sm",
        className,
      )}
    >
      {wordList.map((word, i) => (
        <span
          key={i}
          className="word-pull-up-word"
          style={{ animationDelay: `${i * delayMultiple}s` }}
        >
          {word === "" ? <span>&nbsp;</span> : word}
        </span>
      ))}
    </h1>
  );
}
