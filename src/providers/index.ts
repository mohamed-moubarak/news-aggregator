import { guardianProvider } from './guardian/guardianProvider'
import { createNewsApiProvider } from './newsapi/newsApiProvider'
import { nytProvider } from './nyt/nytProvider'
import type { NewsProvider } from './types'

export type { NewsProvider } from './types'

/** Registry of active sources. Add a provider here to aggregate it. */
export const providers: NewsProvider[] = [guardianProvider, nytProvider, createNewsApiProvider()]
