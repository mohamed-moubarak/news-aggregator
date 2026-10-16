import type { ReactNode } from 'react'

/**
 * Headline link stretched over its card (via ::after), so the whole card is
 * clickable while screen readers hear a single link per article.
 */
export function ArticleLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="[&:focus-visible]:after:outline-focus after:absolute after:inset-0 after:content-[''] focus-visible:outline-none [&:focus-visible]:after:rounded-[inherit] [&:focus-visible]:after:outline-2 [&:focus-visible]:after:outline-offset-2"
    >
      {children}
    </a>
  )
}
