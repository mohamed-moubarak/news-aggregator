import {
  isCategoryId,
  PAGE_SIZE,
  type Article,
  type ArticleQuery,
  type CategoryId,
  type Outlet,
} from '@/domain'
import { getJson } from '@/lib/http'
import { cleanAuthor } from '@/lib/text'

import type { NewsProvider } from '../types'

/** Followed by default until the user customizes their outlets. */
export const DEFAULT_NEWSAPI_OUTLETS = [
  'bbc-news',
  'associated-press',
  'al-jazeera-english',
  'cnn',
  'bloomberg',
  'the-wall-street-journal',
  'the-washington-post',
  'the-verge',
  'techcrunch',
  'wired',
  'espn',
  'national-geographic',
] as const

/** Free plan rejects requests beyond the first 100 results. */
export const MAX_RESULTS = 100

/** Free plan only searches roughly the last month. */
export const SEARCH_WINDOW_DAYS = 29

/**
 * Clamps a date range to the free plan's search window. Returns null when the
 * whole range is older than the window, so the request can be skipped.
 */
export function clampToSearchWindow(
  from: string | undefined,
  to: string | undefined,
  now = new Date(),
): { from?: string; to?: string } | null {
  const earliest = new Date(now.getTime() - SEARCH_WINDOW_DAYS * 86_400_000)
    .toISOString()
    .slice(0, 10)
  if (to && to < earliest) return null
  return { from: !from || from < earliest ? earliest : from, to }
}

/** NewsAPI rejects more than 20 sources per request. */
export const MAX_SOURCES_PER_REQUEST = 20

interface NewsApiSource {
  id: string
  name: string
  url: string
  category: string
}

interface NewsApiArticle {
  source: { id: string | null; name: string }
  author: string | null
  title: string
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
}

export interface NewsApiSourcesResponse {
  sources: NewsApiSource[]
}

export interface NewsApiEverythingResponse {
  articles: NewsApiArticle[]
}

export const toOutlet = (s: NewsApiSource): Outlet => ({
  id: s.id,
  name: s.name,
  provider: 'newsapi',
  url: s.url,
  category: isCategoryId(s.category) ? s.category : undefined,
})

export const toArticle = (a: NewsApiArticle, outlets: Map<string, Outlet>): Article => {
  const outletId = a.source.id ?? a.source.name
  return {
    id: `newsapi:${a.url}`,
    title: a.title,
    description: a.description ?? undefined,
    url: a.url,
    imageUrl: a.urlToImage ?? undefined,
    author: cleanAuthor(a.author),
    publishedAt: a.publishedAt,
    outlet: { id: outletId, name: a.source.name, provider: 'newsapi' },
    category: outlets.get(outletId)?.category,
  }
}

/**
 * NewsAPI's /everything can't filter by category, so categories are applied by
 * narrowing the requested sources to outlets of those categories.
 */
export const resolveSources = (
  outlets: Outlet[],
  outletIds: string[] | undefined,
  categories: CategoryId[] | undefined,
): string[] => {
  const selected = outletIds?.length ? outletIds : [...DEFAULT_NEWSAPI_OUTLETS]
  const byId = new Map(outlets.map((o) => [o.id, o]))
  return selected
    .filter((id) => {
      if (!categories?.length) return true
      const category = byId.get(id)?.category
      return category !== undefined && categories.includes(category)
    })
    .slice(0, MAX_SOURCES_PER_REQUEST)
}

export function createNewsApiProvider(): NewsProvider {
  let outletsPromise: Promise<Outlet[]> | undefined

  const listOutlets = () => {
    outletsPromise ??= getJson<NewsApiSourcesResponse>('/api/newsapi/top-headlines/sources', {
      language: 'en',
    })
      .then((d) => d.sources.map(toOutlet))
      .catch((error: unknown) => {
        outletsPromise = undefined // allow retry
        throw error
      })
    return outletsPromise
  }

  return {
    id: 'newsapi',
    name: 'NewsAPI',
    listOutlets,
    async search(query: ArticleQuery, signal?: AbortSignal) {
      const page = query.page ?? 1
      if (page * PAGE_SIZE > MAX_RESULTS) return []
      const range = clampToSearchWindow(query.from, query.to)
      if (!range) return []
      const outlets = await listOutlets()
      const sources = resolveSources(outlets, query.outletIds, query.categories)
      if (!sources.length) return []
      const data = await getJson<NewsApiEverythingResponse>(
        '/api/newsapi/everything',
        {
          q: query.keyword,
          sources: sources.join(','),
          from: range.from,
          to: range.to,
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: PAGE_SIZE,
          page,
        },
        signal,
      )
      const byId = new Map(outlets.map((o) => [o.id, o]))
      return data.articles.filter((a) => a.title !== '[Removed]').map((a) => toArticle(a, byId))
    },
  }
}
