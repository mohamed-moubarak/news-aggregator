import type { Outlet } from '@/domain'
import { requestedUrl } from '@/test/fetch'

import {
  createNewsApiProvider,
  DEFAULT_NEWSAPI_OUTLETS,
  MAX_SOURCES_PER_REQUEST,
  resolveSources,
} from './newsApiProvider'

const sources = [
  { id: 'bbc-news', name: 'BBC News', url: 'https://bbc.co.uk', category: 'general' },
  { id: 'techcrunch', name: 'TechCrunch', url: 'https://techcrunch.com', category: 'technology' },
]
const outlets: Outlet[] = sources.map((s) => ({
  id: s.id,
  name: s.name,
  provider: 'newsapi',
  category: s.category as Outlet['category'],
}))

const article = {
  source: { id: 'techcrunch', name: 'TechCrunch' },
  author: 'https://facebook.com/x',
  title: 'Sample',
  description: null,
  url: 'https://techcrunch.com/sample',
  urlToImage: null,
  publishedAt: '2026-10-01T10:00:00Z',
}

/** Routes /sources and /everything to separate fixtures. */
function mockNewsApi() {
  const mock = vi.fn(async (url: string) => {
    const body = url.includes('/sources')
      ? { sources }
      : { articles: [article, { ...article, title: '[Removed]', url: 'x' }] }
    return new Response(JSON.stringify(body))
  })
  vi.stubGlobal('fetch', mock)
  return mock
}

afterEach(() => vi.unstubAllGlobals())

describe('resolveSources', () => {
  it('falls back to curated defaults', () => {
    expect(resolveSources(outlets, undefined, undefined)).toEqual([...DEFAULT_NEWSAPI_OUTLETS])
  })
  it('narrows selected outlets by category', () => {
    expect(resolveSources(outlets, ['bbc-news', 'techcrunch'], ['technology'])).toEqual([
      'techcrunch',
    ])
  })
  it('caps the number of sources per request', () => {
    const many = Array.from({ length: 30 }, (_, i) => `s${i}`)
    expect(resolveSources([], many, undefined)).toHaveLength(MAX_SOURCES_PER_REQUEST)
  })
})

describe('newsApiProvider', () => {
  it('lists outlets once and maps categories', async () => {
    const fetch = mockNewsApi()
    const provider = createNewsApiProvider()
    await provider.listOutlets()
    const list = await provider.listOutlets()
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(list[1]).toMatchObject({ id: 'techcrunch', category: 'technology' })
  })

  it('searches /everything with resolved sources and normalizes articles', async () => {
    const fetch = mockNewsApi()
    const result = await createNewsApiProvider().search({
      keyword: 'ai',
      outletIds: ['bbc-news', 'techcrunch'],
      categories: ['technology'],
    })
    const { path, params } = requestedUrl(fetch as never, 1)
    expect(path).toBe('/api/newsapi/everything')
    expect(params).toMatchObject({ q: 'ai', sources: 'techcrunch', sortBy: 'publishedAt' })
    expect(result).toHaveLength(1) // "[Removed]" placeholder dropped
    expect(result[0]).toMatchObject({ author: undefined, category: 'technology' })
  })

  it('skips the request when no source matches the categories', async () => {
    const fetch = mockNewsApi()
    const result = await createNewsApiProvider().search({
      outletIds: ['bbc-news'],
      categories: ['sports'],
    })
    expect(result).toEqual([])
    expect(fetch).toHaveBeenCalledTimes(1) // only /sources
  })
})
