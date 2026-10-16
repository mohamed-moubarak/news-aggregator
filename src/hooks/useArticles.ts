import { useQuery } from '@tanstack/react-query'

import type { ArticleQuery } from '@/domain'
import { aggregator } from '@/services'

export function useArticles(query: ArticleQuery) {
  return useQuery({
    queryKey: ['articles', query],
    queryFn: ({ signal }) => aggregator.search(query, signal),
  })
}
