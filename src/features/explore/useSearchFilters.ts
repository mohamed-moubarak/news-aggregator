import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'

import { parseSearchParams, toSearchParams, type SearchFilters } from './searchParams'

/** Search filters live in the URL so results are shareable and survive reloads. */
export function useSearchFilters() {
  const [params, setParams] = useSearchParams()
  const filters = useMemo(() => parseSearchParams(params), [params])

  const update = useCallback(
    (patch: Partial<SearchFilters>, { replace = false } = {}) =>
      setParams((prev) => toSearchParams({ ...parseSearchParams(prev), ...patch }), { replace }),
    [setParams],
  )

  /** Clears filters but keeps the keyword. */
  const clearFilters = useCallback(
    () => setParams((prev) => toSearchParams({ keyword: parseSearchParams(prev).keyword })),
    [setParams],
  )

  return { filters, update, clearFilters }
}
