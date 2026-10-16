import { Check, Plus } from 'lucide-react'

import { useIsFollowing, usePreferences } from './preferencesStore'

/**
 * Follow toggle for an article's author. Sits above the card's stretched link,
 * and its hit area is padded to 44px for touch.
 */
export function FollowAuthorButton({ author }: { author: string }) {
  const following = useIsFollowing(author)
  const followAuthor = usePreferences((s) => s.followAuthor)
  const unfollowAuthor = usePreferences((s) => s.unfollowAuthor)

  return (
    <button
      type="button"
      aria-pressed={following}
      aria-label={following ? `Unfollow ${author}` : `Follow ${author}`}
      title={following ? `Unfollow ${author}` : `Follow ${author}`}
      onClick={() => (following ? unfollowAuthor(author) : followAuthor(author))}
      className={`relative z-10 inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-xs font-medium transition-colors after:absolute after:-inset-2 after:content-[''] ${
        following
          ? 'bg-accent-soft text-accent-soft-foreground border-transparent'
          : 'border-border text-accent hover:bg-accent-soft'
      }`}
    >
      {following ? (
        <Check className="size-3.5" aria-hidden />
      ) : (
        <Plus className="size-3.5" aria-hidden />
      )}
      {following ? 'Following' : 'Follow'}
    </button>
  )
}
