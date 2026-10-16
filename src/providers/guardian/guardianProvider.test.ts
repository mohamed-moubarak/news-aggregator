import { mockFetchJson, requestedUrl } from '@/test/fetch'

import { guardianProvider } from './guardianProvider'

const result = {
  id: 'technology/2026/oct/01/sample',
  sectionId: 'technology',
  webTitle: 'Sample headline',
  webUrl: 'https://www.theguardian.com/technology/2026/oct/01/sample',
  webPublicationDate: '2026-10-01T10:00:00Z',
  fields: {
    trailText: '<p>Sample <b>trail</b></p>',
    thumbnail: 'https://img/x.jpg',
    byline: 'Jane Doe',
    wordcount: '920',
  },
}

afterEach(() => vi.unstubAllGlobals())

describe('guardianProvider', () => {
  it('maps query to Guardian params', async () => {
    const fetch = mockFetchJson({ response: { results: [] } })
    await guardianProvider.search({
      keyword: 'ai',
      from: '2026-10-01',
      to: '2026-10-10',
      categories: ['technology', 'science'],
      page: 2,
    })
    const { path, params } = requestedUrl(fetch)
    expect(path).toBe('/api/guardian/search')
    expect(params).toMatchObject({
      q: 'ai',
      'from-date': '2026-10-01',
      'to-date': '2026-10-10',
      section: 'technology|science|environment',
      page: '2',
    })
  })

  it('scopes byline searches to the byline field', async () => {
    const fetch = mockFetchJson({ response: { results: [] } })
    await guardianProvider.search({ byline: 'Jane Doe' })
    expect(requestedUrl(fetch).params).toMatchObject({ q: '"Jane Doe"', 'query-fields': 'byline' })
  })

  it('normalizes results into articles', async () => {
    mockFetchJson({ response: { results: [result] } })
    const [article] = await guardianProvider.search({})
    expect(article).toEqual({
      id: 'guardian:technology/2026/oct/01/sample',
      title: 'Sample headline',
      description: 'Sample trail',
      url: result.webUrl,
      imageUrl: 'https://img/x.jpg',
      author: 'Jane Doe',
      publishedAt: '2026-10-01T10:00:00Z',
      wordCount: 920,
      outlet: expect.objectContaining({ id: 'the-guardian', provider: 'guardian' }),
      category: 'technology',
    })
  })
})
