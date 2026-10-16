import { mockFetchJson, requestedUrl } from '@/test/fetch'

import { buildSectionFilter, nytProvider } from './nytProvider'

const doc = {
  _id: 'nyt://article/1',
  web_url: 'https://www.nytimes.com/2026/10/01/business/sample.html',
  abstract: 'Sample abstract',
  pub_date: '2026-10-01T10:00:00Z',
  word_count: 1200,
  section_name: 'Business',
  headline: { main: 'Sample headline' },
  byline: { original: 'By John Roe' },
  multimedia: { default: { url: 'https://static01.nyt.com/x.jpg' } },
}

afterEach(() => vi.unstubAllGlobals())

describe('nytProvider', () => {
  it('maps query to NYT params with 0-based paging and compact dates', async () => {
    const fetch = mockFetchJson({ response: { docs: [] } })
    await nytProvider.search({ keyword: 'ai', from: '2026-10-01', categories: ['sports'], page: 3 })
    const { path, params } = requestedUrl(fetch)
    expect(path).toBe('/api/nyt/articlesearch.json')
    expect(params).toMatchObject({
      q: 'ai',
      begin_date: '20261001',
      fq: 'section.name:("Sports")',
      page: '2',
    })
    expect(params).not.toHaveProperty('end_date')
  })

  it('normalizes docs, including the new multimedia shape', async () => {
    mockFetchJson({ response: { docs: [doc] } })
    const [article] = await nytProvider.search({})
    expect(article).toMatchObject({
      title: 'Sample headline',
      author: 'John Roe',
      imageUrl: 'https://static01.nyt.com/x.jpg',
      category: 'business',
      wordCount: 1200,
      outlet: { id: 'the-new-york-times', provider: 'nyt' },
    })
  })

  it('handles null docs and legacy multimedia arrays', async () => {
    mockFetchJson({ response: { docs: null } })
    expect(await nytProvider.search({})).toEqual([])

    mockFetchJson({ response: { docs: [{ ...doc, multimedia: [{ url: 'images/x.jpg' }] }] } })
    const [article] = await nytProvider.search({})
    expect(article?.imageUrl).toBe('https://www.nytimes.com/images/x.jpg')
  })

  it('builds a section filter only when sections are given', () => {
    expect(buildSectionFilter([])).toBeUndefined()
    expect(buildSectionFilter(['Arts', 'Movies'])).toBe('section.name:("Arts" "Movies")')
  })
})
