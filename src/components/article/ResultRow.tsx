import type { Article } from '@/domain'
import { highlight } from '@/lib/highlight'
import { outletStyle } from '@/lib/outletColor'

import { ArticleImage } from './ArticleImage'
import { ArticleLink } from './ArticleLink'
import { ArticleMeta } from './ArticleMeta'
import { OutletFavicon } from './OutletFavicon'

/** Compact search result: outlet rule, highlighted headline, thumbnail on the right. */
export function ResultRow({ article, keyword }: { article: Article; keyword?: string }) {
  return (
    <article
      style={outletStyle(article.outlet.id)}
      className="bg-surface border-spine group relative grid grid-cols-[1fr_auto] gap-4 rounded-xl border-l-[5px] p-4 transition-shadow duration-200 hover:shadow-lg md:gap-6 md:p-5"
    >
      <div className="flex min-w-0 flex-col gap-1.5">
        <span className="text-spine flex items-center gap-2 text-xs font-semibold">
          <OutletFavicon url={article.url} />
          {article.outlet.name}
        </span>
        <h3 className="font-serif text-lg leading-snug font-medium text-balance group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4 md:text-xl">
          <ArticleLink href={article.url}>{highlight(article.title, keyword)}</ArticleLink>
        </h3>
        {article.description && (
          <p className="text-body line-clamp-2 max-w-[70ch] font-serif text-[15px] leading-normal">
            {highlight(article.description, keyword)}
          </p>
        )}
        <ArticleMeta article={article} className="pt-1.5" />
      </div>
      <ArticleImage
        src={article.imageUrl}
        className="size-20 self-center rounded-lg md:h-24 md:w-36"
      />
    </article>
  )
}
