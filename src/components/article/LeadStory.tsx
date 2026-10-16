import type { Article } from '@/domain'
import { outletStyle } from '@/lib/outletColor'

import { ArticleImage } from './ArticleImage'
import { ArticleLink } from './ArticleLink'
import { ArticleMeta } from './ArticleMeta'

/** The top story: large image beside a headline, with the outlet color as a rule. */
export function LeadStory({ article }: { article: Article }) {
  return (
    <article
      style={outletStyle(article.outlet.id)}
      className="bg-surface group relative grid overflow-hidden rounded-xl md:grid-cols-[1.35fr_1fr]"
    >
      <ArticleImage
        src={article.imageUrl}
        className="aspect-[16/10] size-full md:aspect-auto md:min-h-[360px]"
        fallback={<div className="bg-spine hidden md:block" aria-hidden />}
      />
      <div className="border-spine flex flex-col gap-3 border-t-[5px] p-5 md:gap-3.5 md:border-t-0 md:border-l-[6px] md:p-10">
        <span className="text-spine text-xs font-semibold">{article.outlet.name}</span>
        <h2 className="font-serif text-2xl leading-tight font-medium tracking-[-0.015em] text-balance group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4 md:text-[34px] md:leading-[1.12]">
          <ArticleLink href={article.url}>{article.title}</ArticleLink>
        </h2>
        {article.description && (
          <p className="text-body line-clamp-4 max-w-[46ch] font-serif text-base leading-relaxed md:text-lg">
            {article.description}
          </p>
        )}
        <ArticleMeta article={article} className="mt-auto pt-2 text-[13px]" />
      </div>
    </article>
  )
}
