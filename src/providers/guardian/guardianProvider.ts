import { PAGE_SIZE, type Article, type ArticleQuery, type Outlet } from '@/domain'
import { getJson } from '@/lib/http'
import { cleanAuthor, stripHtml } from '@/lib/text'

import { fromProviderValue, toProviderValues, type CategoryMap } from '../categoryMap'
import type { NewsProvider } from '../types'

const OUTLET: Outlet = {
  id: 'the-guardian',
  name: 'The Guardian',
  provider: 'guardian',
  url: 'https://www.theguardian.com',
}

/** Guardian section ids per app category. */
export const GUARDIAN_SECTIONS: CategoryMap = {
  general: ['world', 'uk-news', 'us-news', 'politics', 'australia-news'],
  business: ['business', 'money'],
  technology: ['technology'],
  science: ['science', 'environment'],
  health: ['society', 'healthcare-network'],
  sports: ['sport', 'football'],
  entertainment: ['culture', 'film', 'music', 'tv-and-radio', 'books', 'stage', 'artanddesign'],
}

interface GuardianResult {
  id: string
  sectionId: string
  webTitle: string
  webUrl: string
  webPublicationDate: string
  fields?: { trailText?: string; thumbnail?: string; byline?: string; wordcount?: string }
}

export interface GuardianResponse {
  response: { results: GuardianResult[] }
}

export const toArticle = (r: GuardianResult): Article => ({
  id: `guardian:${r.id}`,
  title: r.webTitle,
  description: stripHtml(r.fields?.trailText),
  url: r.webUrl,
  imageUrl: r.fields?.thumbnail,
  author: cleanAuthor(r.fields?.byline),
  publishedAt: r.webPublicationDate,
  wordCount: Number(r.fields?.wordcount) || undefined,
  outlet: OUTLET,
  category: fromProviderValue(GUARDIAN_SECTIONS, r.sectionId),
})

export const guardianProvider: NewsProvider = {
  id: 'guardian',
  name: 'The Guardian',
  listOutlets: async () => [OUTLET],
  async search(query: ArticleQuery, signal?: AbortSignal) {
    const sections = toProviderValues(GUARDIAN_SECTIONS, query.categories)
    const data = await getJson<GuardianResponse>(
      '/api/guardian/search',
      {
        q: query.keyword,
        'from-date': query.from,
        'to-date': query.to,
        section: sections.join('|') || undefined,
        'show-fields': 'trailText,thumbnail,byline,wordcount',
        'order-by': 'newest',
        'page-size': PAGE_SIZE,
        page: query.page ?? 1,
      },
      signal,
    )
    return data.response.results.map(toArticle)
  },
}
