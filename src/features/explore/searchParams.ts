import { isCategoryId, type ArticleQuery } from '@/domain'

/** URL keys kept short so shared links stay readable: /explore?q=ai&cat=technology */
const KEYS = { keyword: 'q', from: 'from', to: 'to', categories: 'cat', outletIds: 'src' } as const

export type SearchFilters = Pick<
  ArticleQuery,
  'keyword' | 'from' | 'to' | 'categories' | 'outletIds'
>

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const list = (value: string | null) => value?.split(',').filter(Boolean) ?? []

/** Parses URL params into filters, dropping anything malformed. */
export function parseSearchParams(params: URLSearchParams): SearchFilters {
  const date = (key: string) => {
    const value = params.get(key)
    return value && ISO_DATE.test(value) ? value : undefined
  }
  const categories = list(params.get(KEYS.categories)).filter(isCategoryId)
  const outletIds = list(params.get(KEYS.outletIds))
  return {
    keyword: params.get(KEYS.keyword)?.trim() || undefined,
    from: date(KEYS.from),
    to: date(KEYS.to),
    categories: categories.length ? categories : undefined,
    outletIds: outletIds.length ? outletIds : undefined,
  }
}

export function toSearchParams(filters: SearchFilters): URLSearchParams {
  const params = new URLSearchParams()
  const set = (key: string, value: string | undefined) => value && params.set(key, value)
  set(KEYS.keyword, filters.keyword?.trim())
  set(KEYS.from, filters.from)
  set(KEYS.to, filters.to)
  set(KEYS.categories, filters.categories?.join(','))
  set(KEYS.outletIds, filters.outletIds?.join(','))
  return params
}

/** Number of active filters, excluding the keyword (shown on the mobile Filters button). */
export const countFilters = (f: SearchFilters) =>
  (f.from || f.to ? 1 : 0) + (f.categories?.length ?? 0) + (f.outletIds?.length ?? 0)
