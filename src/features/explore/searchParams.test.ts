import { countFilters, parseSearchParams, toSearchParams } from './searchParams'

describe('search params', () => {
  it('round-trips filters through the URL', () => {
    const filters = {
      keyword: 'battery storage',
      from: '2026-10-01',
      to: '2026-10-15',
      categories: ['business' as const, 'science' as const],
      outletIds: ['the-guardian', 'bbc-news'],
    }
    const params = toSearchParams(filters)
    expect(params.toString()).toBe(
      'q=battery+storage&from=2026-10-01&to=2026-10-15&cat=business%2Cscience&src=the-guardian%2Cbbc-news',
    )
    expect(parseSearchParams(params)).toEqual(filters)
  })

  it('drops malformed values', () => {
    const parsed = parseSearchParams(
      new URLSearchParams('q=%20&from=yesterday&cat=nope,sports&src='),
    )
    expect(parsed).toEqual({
      keyword: undefined,
      from: undefined,
      to: undefined,
      categories: ['sports'],
      outletIds: undefined,
    })
  })

  it('counts a date range as one filter', () => {
    expect(countFilters({ from: '2026-10-01', to: '2026-10-02', categories: ['sports'] })).toBe(2)
  })
})
