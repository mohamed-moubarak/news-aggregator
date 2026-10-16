import type { Article } from '@/domain'
import { readingTime } from '@/lib/readingTime'
import { timeAgo } from '@/lib/time'

export function ArticleMeta({ article, className = '' }: { article: Article; className?: string }) {
  const minutes = readingTime(article.wordCount)
  return (
    <div className={`text-muted flex flex-wrap items-center gap-x-3 gap-y-1 text-xs ${className}`}>
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
    </div>
  )
}
