import type { Article, ArticleQuery, Outlet, ProviderId } from '@/domain'

/**
 * Contract every news source implements. The UI and aggregator depend only on
 * this, so adding a source means adding an adapter and registering it.
 */
export interface NewsProvider {
  readonly id: ProviderId
  readonly name: string
  /** Outlets this provider can serve. */
  listOutlets(signal?: AbortSignal): Promise<Outlet[]>
  /**
   * Returns articles for the query. `outletIds` passed here are already
   * narrowed to this provider's outlets.
   */
  search(query: ArticleQuery, signal?: AbortSignal): Promise<Article[]>
}
