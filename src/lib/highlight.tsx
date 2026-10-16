import type { ReactNode } from 'react'

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Wraps each keyword term found in `text` with <mark>. */
export function highlight(text: string, keyword: string | undefined): ReactNode {
  const terms = keyword?.split(/\s+/).filter((t) => t.length > 1) ?? []
  if (!terms.length) return text
  const pattern = new RegExp(`(${terms.map(escape).join('|')})`, 'gi')
  return text.split(pattern).map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="bg-highlight rounded-sm px-0.5 text-inherit">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}
