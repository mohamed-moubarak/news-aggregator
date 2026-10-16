import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import type { ArticleQuery } from '@/domain'
import { aggregator, dedupe } from '@/services'

/** Free tiers make deep paging expensive; five pages (~250 articles) is plenty to browse. */
const MAX_PAGES = 5

/** Paged aggregate search; pages are appended in order so the list never reshuffles. */
export function useInfiniteArticles(query: ArticleQuery) {
  const result = useInfiniteQuery({
    queryKey: ['articles', 'infinite', query],
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) => aggregator.search({ ...query, page: pageParam }, signal),
    getNextPageParam: (lastPage, pages) =>
      lastPage.articles.length > 0 && pages.length < MAX_PAGES ? pages.length + 1 : undefined,
  })

  const pages = result.data?.pages
  const articles = useMemo(() => dedupe(pages?.flatMap((p) => p.articles) ?? []), [pages])
  // Report failures from the first page; later pages failing just end the scroll.
  const failures = pages?.[0]?.failures ?? []

  return { ...result, articles, failures }
}
