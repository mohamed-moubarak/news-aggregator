import { useState } from 'react'

/** Decorative article image that removes itself if the URL fails to load. */
export function ArticleImage({ src, className = '' }: { src?: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) return null
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={`bg-default object-cover ${className}`}
    />
  )
}
