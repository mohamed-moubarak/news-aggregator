import type { Article, ArticleQuery, Outlet, ProviderId } from '@/domain'
import type { NewsProvider } from '@/providers'

import { createAggregator, dedupe, matchesAuthors } from './aggregator'

const article = (over: Partial<Article>): Article => ({
  id: over.url ?? 'id',
  title: 'Title',
  url: 'https://example.com/a',
  publishedAt: '2026-10-01T00:00:00Z',
  outlet: { id: 'o', name: 'O', provider: 'guardian' },
  ...over,
})

function fakeProvider(
  id: ProviderId,
  outlets: string[],
  result: Article[] | Error,
): NewsProvider & { search: ReturnType<typeof vi.fn> } {
  return {
    id,
    name: id,
    listOutlets: async () => outlets.map((o): Outlet => ({ id: o, name: o, provider: id })),
    search: vi.fn(async (_q: ArticleQuery) => {
      if (result instanceof Error) throw result
      return result
    }),
  }
}

describe('createAggregator.search', () => {
  it('merges providers newest-first and reports failures without failing the whole search', async () => {
    const a = fakeProvider(
      'guardian',
      ['g'],
      [article({ url: 'https://g/1', title: 'Old', publishedAt: '2026-10-01' })],
    )
    const b = fakeProvider(
      'nyt',
      ['n'],
      [article({ url: 'https://n/1', title: 'New', publishedAt: '2026-10-05' })],
    )
    const c = fakeProvider('newsapi', ['x'], new Error('rate limited'))

    const { articles, failures } = await createAggregator([a, b, c]).search({})

    expect(articles.map((x) => x.title)).toEqual(['New', 'Old'])
    expect(failures).toEqual([
      { providerId: 'newsapi', providerName: 'newsapi', message: 'rate limited' },
    ])
  })

  it('only queries providers owning a selected outlet, passing their own ids', async () => {
    const a = fakeProvider('guardian', ['g'], [])
    const b = fakeProvider('newsapi', ['bbc', 'cnn'], [])

    await createAggregator([a, b]).search({ outletIds: ['cnn'] })

    expect(a.search).not.toHaveBeenCalled()
    expect(b.search).toHaveBeenCalledWith(
      expect.objectContaining({ outletIds: ['cnn'] }),
      undefined,
    )
  })

  it('filters by author on merged results', async () => {
    const a = fakeProvider(
      'guardian',
      ['g'],
      [
        article({ url: 'https://g/1', title: 'One', author: 'Jane Doe' }),
        article({ url: 'https://g/2', title: 'Two', author: 'John Roe' }),
      ],
    )
    const { articles } = await createAggregator([a]).search({ authors: ['jane'] })
    expect(articles.map((x) => x.title)).toEqual(['One'])
  })
})

describe('createAggregator.listOutlets', () => {
  it('combines outlets sorted by name and tolerates failures', async () => {
    const ok = fakeProvider('guardian', ['zeta', 'alpha'], [])
    const broken: NewsProvider = {
      ...fakeProvider('newsapi', [], []),
      listOutlets: () => Promise.reject(new Error('down')),
    }
    const { outlets, failures } = await createAggregator([ok, broken]).listOutlets()
    expect(outlets.map((o) => o.id)).toEqual(['alpha', 'zeta'])
    expect(failures).toHaveLength(1)
  })
})

describe('dedupe', () => {
  it('drops repeats by normalized URL or headline', () => {
    const items = [
      article({ url: 'https://x.com/a?utm=1', title: 'A' }),
      article({ url: 'https://x.com/a/', title: 'A copy' }),
      article({ url: 'https://y.com/b', title: ' a ' }),
      article({ url: 'https://z.com/c', title: 'C' }),
      article({ url: 'https://z.com/c2', title: 'C', publishedAt: '2026-10-02T00:00:00Z' }),
    ]
    expect(dedupe(items).map((a) => a.url)).toEqual([
      'https://x.com/a?utm=1',
      'https://z.com/c',
      'https://z.com/c2',
    ])
  })
})

describe('matchesAuthors', () => {
  it('passes everything when no authors are set and rejects unknown authors otherwise', () => {
    expect(matchesAuthors(article({}), [])).toBe(true)
    expect(matchesAuthors(article({}), ['jane'])).toBe(false)
  })
})
