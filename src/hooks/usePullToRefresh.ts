import { useEffect, useRef, useState } from 'react'

/** Distance (px, after resistance) the user must pull to trigger a refresh. */
export const PULL_THRESHOLD = 64
const MAX_PULL = 96

/** Finger travel → indicator travel, with rubber-band resistance. */
export const resist = (dy: number) => Math.min(MAX_PULL, Math.max(0, dy) * 0.5)

export type PullState = 'idle' | 'pulling' | 'armed' | 'refreshing'

/**
 * Touch pull-to-refresh at the top of the page. Inactive on mouse/trackpad
 * devices, where a refresh is one keypress away.
 */
export function usePullToRefresh(onRefresh: () => Promise<unknown>) {
  const [distance, setDistance] = useState(0)
  const [state, setState] = useState<PullState>('idle')
  const startY = useRef<number | null>(null)
  const refreshRef = useRef(onRefresh)

  // Keep the latest callback without re-binding touch listeners.
  useEffect(() => {
    refreshRef.current = onRefresh
  }, [onRefresh])

  useEffect(() => {
    if (!window.matchMedia?.('(pointer: coarse)').matches) return

    let current = 0
    let busy = false

    const onStart = (e: TouchEvent) => {
      startY.current = window.scrollY <= 0 && !busy ? (e.touches[0]?.clientY ?? null) : null
    }
    const onMove = (e: TouchEvent) => {
      if (startY.current === null) return
      current = resist((e.touches[0]?.clientY ?? 0) - startY.current)
      setDistance(current)
      setState(current === 0 ? 'idle' : current >= PULL_THRESHOLD ? 'armed' : 'pulling')
    }
    const onEnd = () => {
      if (startY.current === null) return
      startY.current = null
      if (current < PULL_THRESHOLD) {
        setDistance(0)
        setState('idle')
        return
      }
      busy = true
      setState('refreshing')
      setDistance(PULL_THRESHOLD)
      refreshRef.current().finally(() => {
        busy = false
        current = 0
        setDistance(0)
        setState('idle')
      })
    }

    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('touchend', onEnd)
    window.addEventListener('touchcancel', onEnd)
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onEnd)
      window.removeEventListener('touchcancel', onEnd)
    }
  }, [])

  return { distance, state }
}
