import type { Article } from '@/domain'

import { suggestAuthors } from './suggestAuthors'

const article = (author?: string): Article => ({
  id: Math.random().toString(),
  title: 't',
  url: 'https://x',
  publishedAt: '2026-10-16',
  outlet: { id: 'o', name: 'O', provider: 'guardian' },
  author,
})

it('ranks individual bylines by frequency and skips desks', () => {
  const articles = [
    article('Jane Doe'),
    article('John Roe; Jane Doe'),
    article('Guardian staff'),
    article(undefined),
    article('Jane Doe in Paris'),
    article('Alex Kim'),
  ]
  expect(suggestAuthors(articles)).toEqual(['Jane Doe', 'John Roe', 'Alex Kim'])
  expect(suggestAuthors(articles, 1)).toEqual(['Jane Doe'])
})
