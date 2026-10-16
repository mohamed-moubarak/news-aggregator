import type { CategoryId } from './category'
import type { Outlet } from './outlet'

/** Provider-agnostic article shape that every adapter normalizes into. */
export interface Article {
  id: string
  title: string
  description?: string
  url: string
  imageUrl?: string
  author?: string
  publishedAt: string
  outlet: Pick<Outlet, 'id' | 'name' | 'provider'>
  category?: CategoryId
}
