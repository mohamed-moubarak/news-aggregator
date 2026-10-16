import type { Article, ArticleQuery, Outlet, ProviderId } from '@/domain'
import type { NewsProvider } from '@/providers'

export interface ProviderFailure {
  providerId: ProviderId
  providerName: string
  message: string
}

export interface AggregateResult {
  articles: Article[]
  /** Providers that failed; their articles are missing but others still render. */
  failures: ProviderFailure[]
}

export interface OutletCatalog {
  outlets: Outlet[]
  failures: ProviderFailure[]
}

const toFailure = (provider: NewsProvider, reason: unknown): ProviderFailure => ({
  providerId: provider.id,
  providerName: provider.name,
  message: reason instanceof Error ? reason.message : String(reason),
})

const normalizeUrl = (url: string) =>
  url
    .replace(/[?#].*$/, '')
    .replace(/\/$/, '')
    .toLowerCase()

/** Removes the same story syndicated under the same URL or headline. */
export const dedupe = (articles: Article[]): Article[] => {
  const seen = new Set<string>()
  return articles.filter((a) => {
    const keys = [normalizeUrl(a.url), a.title.trim().toLowerCase()]
    if (keys.some((k) => seen.has(k))) return false
    keys.forEach((k) => seen.add(k))
    return true
  })
}

export const byNewest = (a: Article, b: Article) => b.publishedAt.localeCompare(a.publishedAt)

/** No provider filters by author reliably, so it's applied to merged results. */
export const matchesAuthors = (article: Article, authors: string[] | undefined) => {
  if (!authors?.length) return true
  const author = article.author?.toLowerCase()
  return !!author && authors.some((name) => author.includes(name.trim().toLowerCase()))
}

export function createAggregator(providers: NewsProvider[]) {
  /** Narrows `outletIds` to this provider; `null` means the provider isn't selected. */
  const outletIdsFor = async (
    provider: NewsProvider,
    outletIds: string[] | undefined,
    signal?: AbortSignal,
  ): Promise<string[] | undefined | null> => {
    if (!outletIds?.length) return undefined
    const own = new Set((await provider.listOutlets(signal)).map((o) => o.id))
    const mine = outletIds.filter((id) => own.has(id))
    return mine.length ? mine : null
  }

  return {
    async listOutlets(signal?: AbortSignal): Promise<OutletCatalog> {
      const settled = await Promise.allSettled(providers.map((p) => p.listOutlets(signal)))
      const result: OutletCatalog = { outlets: [], failures: [] }
      settled.forEach((s, i) => {
        if (s.status === 'fulfilled') result.outlets.push(...s.value)
        else result.failures.push(toFailure(providers[i]!, s.reason))
      })
      result.outlets.sort((a, b) => a.name.localeCompare(b.name))
      return result
    },

    async search(query: ArticleQuery, signal?: AbortSignal): Promise<AggregateResult> {
      const settled = await Promise.allSettled(
        providers.map(async (provider) => {
          const outletIds = await outletIdsFor(provider, query.outletIds, signal)
          if (outletIds === null) return []
          return provider.search({ ...query, outletIds }, signal)
        }),
      )

      const articles: Article[] = []
      const failures: ProviderFailure[] = []
      settled.forEach((s, i) => {
        if (s.status === 'fulfilled') articles.push(...s.value)
        else failures.push(toFailure(providers[i]!, s.reason))
      })

      return {
        articles: dedupe(articles)
          .filter((a) => matchesAuthors(a, query.authors))
          .sort(byNewest),
        failures,
      }
    },
  }
}

export type Aggregator = ReturnType<typeof createAggregator>
