import { useQuery } from '@tanstack/react-query'

import { aggregator } from '@/services'

/** Outlet catalog across providers; it rarely changes, so it's cached for the session. */
export function useOutlets() {
  return useQuery({
    queryKey: ['outlets'],
    queryFn: ({ signal }) => aggregator.listOutlets(signal),
    staleTime: Infinity,
  })
}
