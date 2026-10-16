import type { CategoryId } from './category'

export type ProviderId = 'guardian' | 'nyt' | 'newsapi'

/** A publication the user can follow. One provider may serve many outlets. */
export interface Outlet {
  id: string
  name: string
  provider: ProviderId
  url?: string
  category?: CategoryId
}
