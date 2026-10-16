import { Skeleton } from '@heroui/react'
import { Link } from 'react-router'

import { ArticleCard } from '@/components/article'
import { MAX_AUTHORS_IN_FEED, useAuthorStories } from '@/hooks/useAuthorStories'

/** Horizontal row of the latest stories by authors the user follows. */
export function FollowedAuthorsRow({ authors }: { authors: string[] }) {
  const { articles, isPending, skipped } = useAuthorStories(authors)
  if (!authors.length || (!isPending && !articles.length)) return null

  return (
    <section aria-labelledby="followed-authors" className="grid gap-3">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="followed-authors" className="font-serif text-xl font-medium md:text-2xl">
          From writers you follow
        </h2>
        <Link
          to="/you"
          className="text-accent text-sm font-medium underline-offset-4 hover:underline"
        >
          Manage
        </Link>
      </div>
      {skipped > 0 && (
        <p className="text-muted -mt-1 text-xs">
          Showing your first {MAX_AUTHORS_IN_FEED} writers.
        </p>
      )}
      <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:-mx-10 md:px-10">
        {isPending
          ? Array.from({ length: 3 }, (_, i) => (
              <li key={i} className="w-[280px] shrink-0 md:w-[320px]">
                <Skeleton className="h-64 rounded-xl" />
              </li>
            ))
          : articles.map((a) => (
              <li key={a.id} className="grid w-[280px] shrink-0 snap-start md:w-[320px]">
                <ArticleCard article={a} />
              </li>
            ))}
      </ul>
    </section>
  )
}
