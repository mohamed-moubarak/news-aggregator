import { Button, Spinner } from '@heroui/react'
import { useEffect, useRef } from 'react'

interface LoadMoreProps {
  hasMore: boolean
  isLoading: boolean
  onLoadMore: () => void
}

/**
 * Infinite-scroll trigger: loads the next page as it nears the viewport, with
 * a visible button as a fallback for keyboard users and failed observers.
 */
export function LoadMore({ hasMore, isLoading, onLoadMore }: LoadMoreProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node || !hasMore || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => entry?.isIntersecting && !isLoading && onLoadMore(),
      { rootMargin: '600px 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, isLoading, onLoadMore])

  if (!hasMore) {
    return <p className="text-muted py-8 text-center text-sm">You're all caught up.</p>
  }
  return (
    <div ref={ref} className="grid place-items-center py-8">
      {isLoading ? (
        <Spinner aria-label="Loading more articles" />
      ) : (
        <Button variant="secondary" onPress={onLoadMore}>
          Load more
        </Button>
      )}
    </div>
  )
}
