import { providers } from '@/providers'

import { createAggregator } from './aggregator'

export * from './aggregator'

/** App-wide aggregator instance wired to the registered providers. */
export const aggregator = createAggregator(providers)
