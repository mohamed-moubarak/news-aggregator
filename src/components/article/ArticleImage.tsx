import { useState, type ReactNode } from 'react'

interface ArticleImageProps {
  src?: string
  className?: string
  /** Rendered instead when there's no image or it fails to load. */
  fallback?: ReactNode
  /** Above-the-fold images (the lead story) load eagerly at high priority. */
  priority?: boolean
}

/** Decorative article image that swaps to `fallback` if missing or broken. */
export function ArticleImage({
  src,
  className = '',
  fallback = null,
  priority = false,
}: ArticleImageProps) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) return fallback
  return (
    <img
      src={src}
      alt=""
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      onError={() => setFailed(true)}
      className={`bg-default object-cover ${className}`}
    />
  )
}
