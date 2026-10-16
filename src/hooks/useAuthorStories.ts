import { useQueries } from '@tanstack/react-query'

import type { Article } from '@/domain'
import { aggregator, byNewest, dedupe, type AggregateResult } from '@/services'

/** Each followed author costs one request per provider, so only the first few are queried. */
export const MAX_AUTHORS_IN_FEED = 5
const MAX_STORIES = 12

/** Takes one story from each author in turn so a prolific writer can't fill the row. */
export function interleave(lists: Article[][]): Article[] {
  const queues = lists.map((l) => [...l].sort(byNewest))
  const out: Article[] = []
  while (queues.some((q) => q.length)) {
    for (const q of queues) {
      const next = q.shift()
      if (next) out.push(next)
    }
  }
  return out
}

const combine = (results: { data?: AggregateResult; isPending: boolean }[]) => ({
  articles: dedupe(interleave(results.map((r) => r.data?.articles ?? []))).slice(0, MAX_STORIES),
  isPending: results.length > 0 && results.every((r) => r.isPending),
})

/**
 * Latest stories by followed authors: a byline search per author (exact on the
 * Guardian, best-effort elsewhere), kept only when the byline really matches.
 */
export function useAuthorStories(authors: string[]) {
  const stories = useQueries({
    queries: authors.slice(0, MAX_AUTHORS_IN_FEED).map((author) => ({
      queryKey: ['author-stories', author.toLowerCase()],
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        aggregator.search({ byline: author, authors: [author] }, signal),
    })),
    combine,
  })
  return { ...stories, skipped: Math.max(0, authors.length - MAX_AUTHORS_IN_FEED) }
}
