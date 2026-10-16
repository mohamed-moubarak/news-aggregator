import { timeAgo } from './time'

const now = Date.parse('2026-10-16T12:00:00Z')
const ago = (ms: number) => new Date(now - ms).toISOString()

describe('timeAgo', () => {
  it.each([
    [20_000, 'just now'],
    [5 * 60_000, '5m ago'],
    [3 * 3_600_000, '3h ago'],
    [26 * 3_600_000, 'yesterday'],
    [9 * 86_400_000, 'last wk.'],
  ])('%i ms ago → %s', (ms, expected) => {
    expect(timeAgo(ago(ms), now)).toBe(expected)
  })

  it('falls back to a date after four weeks', () => {
    expect(timeAgo('2026-08-01T00:00:00Z', now)).toBe('1 Aug')
  })
})
