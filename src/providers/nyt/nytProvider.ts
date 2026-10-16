import { type Article, type ArticleQuery, type Outlet } from '@/domain'
import { toCompactDate } from '@/lib/date'
import { getJson } from '@/lib/http'
import { cleanAuthor } from '@/lib/text'

import { fromProviderValue, toProviderValues, type CategoryMap } from '../categoryMap'
import type { NewsProvider } from '../types'

const OUTLET: Outlet = {
  id: 'the-new-york-times',
  name: 'The New York Times',
  provider: 'nyt',
  url: 'https://www.nytimes.com',
}

/** NYT `section.name` values per app category. */
export const NYT_SECTIONS: CategoryMap = {
  general: ['World', 'U.S.', 'Politics', 'New York', 'Opinion'],
  business: ['Business', 'Your Money', 'Real Estate'],
  technology: ['Technology'],
  science: ['Science', 'Climate'],
  health: ['Health', 'Well'],
  sports: ['Sports'],
  entertainment: ['Arts', 'Movies', 'Theater', 'Books', 'Style', 'Food'],
}

interface NytDoc {
  _id: string
  web_url: string
  abstract?: string
  snippet?: string
  pub_date: string
  section_name?: string
  headline: { main: string }
  byline?: { original?: string | null }
  multimedia?: { default?: { url?: string } } | Array<{ url: string }> | null
}

export interface NytResponse {
  response: { docs: NytDoc[] | null }
}

const imageOf = (media: NytDoc['multimedia']): string | undefined => {
  if (!media) return undefined
  // Legacy shape: array of relative URLs.
  if (Array.isArray(media)) {
    const url = media[0]?.url
    return url ? `https://www.nytimes.com/${url}` : undefined
  }
  return media.default?.url
}

export const toArticle = (doc: NytDoc): Article => ({
  id: `nyt:${doc._id}`,
  title: doc.headline.main,
  description: doc.abstract || doc.snippet || undefined,
  url: doc.web_url,
  imageUrl: imageOf(doc.multimedia),
  author: cleanAuthor(doc.byline?.original),
  publishedAt: doc.pub_date,
  outlet: OUTLET,
  category: fromProviderValue(NYT_SECTIONS, doc.section_name),
})

export const buildSectionFilter = (sections: string[]) =>
  sections.length ? `section.name:(${sections.map((s) => `"${s}"`).join(' ')})` : undefined

export const nytProvider: NewsProvider = {
  id: 'nyt',
  name: 'The New York Times',
  listOutlets: async () => [OUTLET],
  async search(query: ArticleQuery, signal?: AbortSignal) {
    const data = await getJson<NytResponse>(
      '/api/nyt/articlesearch.json',
      {
        q: query.keyword,
        begin_date: toCompactDate(query.from),
        end_date: toCompactDate(query.to),
        fq: buildSectionFilter(toProviderValues(NYT_SECTIONS, query.categories)),
        sort: 'newest',
        // NYT pages are 0-based and fixed at 10 items.
        page: (query.page ?? 1) - 1,
      },
      signal,
    )
    return (data.response.docs ?? []).map(toArticle)
  },
}
