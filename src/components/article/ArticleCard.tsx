import type { Article } from '@/domain'
import { categoryLabel } from '@/lib/categoryLabel'
import { outletStyle } from '@/lib/outletColor'

import { ArticleImage } from './ArticleImage'
import { ArticleLink } from './ArticleLink'
import { ArticleMeta } from './ArticleMeta'
import { OutletFavicon } from './OutletFavicon'

interface ArticleCardProps {
  article: Article
  /** Wide variant: spans two grid columns with the image beside the text. */
  featured?: boolean
}

/** Feed card: outlet spine on the left, optional thumbnail, headline. */
export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const category = categoryLabel(article.category)
  return (
    <article
      style={outletStyle(article.outlet.id)}
      className={`bg-surface group relative grid grid-cols-[2rem_1fr] overflow-hidden rounded-xl transition-shadow duration-200 hover:shadow-lg md:grid-cols-[2.125rem_1fr] ${
        featured ? 'sm:col-span-2' : ''
      }`}
    >
      <div className="bg-spine flex flex-col items-center justify-between gap-3 py-3.5" aria-hidden>
        <OutletFavicon url={article.url} />
        <span className="rotate-180 truncate text-[11px] font-semibold tracking-wide text-white [writing-mode:vertical-rl] md:text-xs dark:text-[#0f1730]">
          {article.outlet.name}
        </span>
      </div>
      <div
        className={`grid min-w-0 gap-4 p-4 md:p-5 ${featured ? 'sm:grid-cols-[1.2fr_1fr] sm:gap-6' : ''}`}
      >
        <ArticleImage
          src={article.imageUrl}
          className={`aspect-[16/9] w-full rounded-lg ${featured ? 'sm:aspect-auto sm:h-full sm:min-h-56' : ''}`}
        />
        <div className="flex min-w-0 flex-col gap-2.5">
          <p className="sr-only">{article.outlet.name}</p>
          {category && <span className="text-muted text-xs font-medium">{category}</span>}
          <h3
            className={`font-serif leading-snug font-medium tracking-[-0.01em] text-balance group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4 ${
              featured
                ? 'text-xl md:text-[26px] md:leading-[1.18]'
                : 'text-lg md:text-[21px] md:leading-[1.22]'
            }`}
          >
            <ArticleLink href={article.url}>{article.title}</ArticleLink>
          </h3>
          {(featured || !article.imageUrl) && article.description && (
            <p className="text-body line-clamp-3 font-serif text-[15px] leading-normal">
              {article.description}
            </p>
          )}
          <ArticleMeta article={article} className="mt-auto pt-1" />
        </div>
      </div>
    </article>
  )
}
