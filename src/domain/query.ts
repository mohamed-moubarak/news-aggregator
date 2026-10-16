import type { CategoryId } from './category'

export interface ArticleQuery {
  keyword?: string
  /** Inclusive ISO date (YYYY-MM-DD). */
  from?: string
  /** Inclusive ISO date (YYYY-MM-DD). */
  to?: string
  categories?: CategoryId[]
  /** Restrict to these outlets; empty/undefined means each provider's defaults. */
  outletIds?: string[]
  authors?: string[]
  /** Find articles by this writer (byline search where the provider supports it). */
  byline?: string
  /** 1-based. */
  page?: number
}

export const PAGE_SIZE = 20
