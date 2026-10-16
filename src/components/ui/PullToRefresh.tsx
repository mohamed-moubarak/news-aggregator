import { Spinner } from '@heroui/react'
import { ArrowDown } from 'lucide-react'

import { PULL_THRESHOLD, usePullToRefresh } from '@/hooks/usePullToRefresh'

const LABELS = {
  idle: '',
  pulling: 'Pull to refresh',
  armed: 'Release to refresh',
  refreshing: 'Refreshing…',
} as const

/** Pull-down indicator that sits under the top bar on touch devices. */
export function PullToRefresh({ onRefresh }: { onRefresh: () => Promise<unknown> }) {
  const { distance, state } = usePullToRefresh(onRefresh)
  const progress = Math.min(1, distance / PULL_THRESHOLD)

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-16 z-20 flex justify-center motion-safe:transition-transform"
      style={{ transform: `translateY(${distance - 48}px)`, opacity: progress }}
    >
      {state !== 'idle' && (
        <div className="bg-surface text-muted flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium shadow-lg">
          {state === 'refreshing' ? (
            <Spinner size="sm" aria-hidden />
          ) : (
            <ArrowDown
              aria-hidden
              className="size-4 motion-safe:transition-transform"
              style={{ transform: `rotate(${state === 'armed' ? 180 : 0}deg)` }}
            />
          )}
          {LABELS[state]}
        </div>
      )}
    </div>
  )
}
