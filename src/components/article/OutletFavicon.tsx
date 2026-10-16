import { useState } from 'react'

const hostOf = (url: string) => {
  try {
    return new URL(url).hostname
  } catch {
    return undefined
  }
}

/** Outlet favicon from the article's domain; hides itself if unavailable. */
export function OutletFavicon({ url, className = '' }: { url: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  const host = hostOf(url)
  if (!host || failed) return null
  return (
    <img
      src={`https://icons.duckduckgo.com/ip3/${host}.ico`}
      alt=""
      width={16}
      height={16}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`size-4 rounded-sm bg-white object-contain ${className}`}
    />
  )
}
