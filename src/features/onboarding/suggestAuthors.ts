import type { Article } from '@/domain'
import { primaryAuthor } from '@/lib/author'

/** Most frequent individual bylines in a set of articles, for "writers to follow". */
export function suggestAuthors(articles: Article[], limit = 12): string[] {
  const counts = new Map<string, number>()
  for (const a of articles) {
    const name = primaryAuthor(a.author)
    if (name) counts.set(name, (counts.get(name) ?? 0) + 1)
  }
  // Map keeps insertion order, so ties stay in newest-first order.
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name]) => name)
}
