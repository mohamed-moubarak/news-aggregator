import type { Article } from '@/domain'
import { FollowAuthorButton } from '@/features/preferences/FollowAuthorButton'
import { primaryAuthor } from '@/lib/author'
import { readingTime } from '@/lib/readingTime'
import { timeAgo } from '@/lib/time'

interface ArticleMetaProps {
  article: Article
  className?: string
  /** Show the follow toggle for the article's author. */
  withFollow?: boolean
}

export function ArticleMeta({ article, className = '', withFollow = true }: ArticleMetaProps) {
  const minutes = readingTime(article.wordCount)
  const author = primaryAuthor(article.author)
  return (
    <div
      className={`text-muted flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs ${className}`}
    >
      {article.author && (
        <span
          title={article.author}
          className="text-foreground max-w-[28ch] truncate font-semibold"
        >
          {article.author}
        </span>
      )}
      <time dateTime={article.publishedAt} className="whitespace-nowrap">
        {timeAgo(article.publishedAt)}
      </time>
      {minutes && <span className="whitespace-nowrap">{minutes}</span>}
      {withFollow && author && (
        <span className="ml-auto">
          <FollowAuthorButton author={author} />
        </span>
      )}
    </div>
  )
}
