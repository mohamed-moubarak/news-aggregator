import type { Article } from '@/domain'
import { categoryLabel } from '@/lib/categoryLabel'
import { outletStyle } from '@/lib/outletColor'

import { ArticleImage } from './ArticleImage'
import { ArticleLink } from './ArticleLink'
import { ArticleMeta } from './ArticleMeta'

/** Standard feed card: outlet spine on the left, optional thumbnail, headline. */
export function ArticleCard({ article }: { article: Article }) {
  const category = categoryLabel(article.category)
  return (
    <article
      style={outletStyle(article.outlet.id)}
      className="bg-surface group relative grid grid-cols-[2rem_1fr] overflow-hidden rounded-xl transition-shadow hover:shadow-lg md:grid-cols-[2.125rem_1fr]"
    >
      <div className="bg-spine flex items-end justify-center py-3.5" aria-hidden>
        <span className="rotate-180 truncate text-[11px] font-semibold tracking-wide text-white [writing-mode:vertical-rl] md:text-xs">
          {article.outlet.name}
        </span>
      </div>
      <div className="flex min-w-0 flex-col gap-2.5 p-4 md:p-5">
        <ArticleImage src={article.imageUrl} className="mb-1 aspect-[16/9] w-full rounded-lg" />
        <p className="sr-only">{article.outlet.name}</p>
        {category && <span className="text-muted text-xs font-medium">{category}</span>}
        <h3 className="font-serif text-lg leading-snug font-medium tracking-[-0.01em] text-balance group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4 md:text-[21px] md:leading-[1.22]">
          <ArticleLink href={article.url}>{article.title}</ArticleLink>
        </h3>
        {!article.imageUrl && article.description && (
          <p className="text-body line-clamp-3 font-serif text-[15px] leading-normal">
            {article.description}
          </p>
        )}
        <ArticleMeta article={article} className="mt-auto pt-1" />
      </div>
    </article>
  )
}
