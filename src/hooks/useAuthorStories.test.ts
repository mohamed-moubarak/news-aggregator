import type { Article } from '@/domain'

import { interleave } from './useAuthorStories'

const a = (id: string, publishedAt: string): Article => ({
  id,
  title: id,
  url: `https://x/${id}`,
  publishedAt,
  outlet: { id: 'o', name: 'O', provider: 'guardian' },
})

it('alternates between authors, newest first within each', () => {
  const prolific = [a('p1', '2026-10-01'), a('p3', '2026-10-03'), a('p2', '2026-10-02')]
  const occasional = [a('o1', '2026-09-01')]
  expect(interleave([prolific, occasional]).map((x) => x.id)).toEqual(['p3', 'o1', 'p2', 'p1'])
})
