import type { Article } from '@/domain'

import { ArticleCard } from './ArticleCard'
import { ArticleCardSkeleton, LeadStorySkeleton } from './ArticleSkeletons'
import { LeadStory } from './LeadStory'

const GRID = 'grid grid-flow-row-dense gap-3 sm:grid-cols-2 md:gap-[18px] lg:grid-cols-3'

/** Every fifth card (with an image) goes wide, giving the grid an editorial rhythm. */
const isFeatured = (article: Article, index: number) => index % 5 === 3 && !!article.imageUrl

interface ArticleGridProps {
  articles: Article[]
  /** Promote the first article to a lead story. */
  withLead?: boolean
}

export function ArticleGrid({ articles, withLead = false }: ArticleGridProps) {
  const [lead, ...rest] = articles
  const cards = withLead ? rest : articles
  return (
    <div className="grid gap-3 md:gap-7">
      {withLead && lead && <LeadStory article={lead} />}
      <div className={GRID}>
        {cards.map((a, i) => (
          <ArticleCard key={a.id} article={a} featured={isFeatured(a, i)} />
        ))}
      </div>
    </div>
  )
}

export function ArticleGridSkeleton({ withLead = false }: { withLead?: boolean }) {
  return (
    <div className="grid gap-3 md:gap-7" aria-busy="true" aria-label="Loading articles">
      {withLead && <LeadStorySkeleton />}
      <div className={GRID}>
        {Array.from({ length: 6 }, (_, i) => (
          <ArticleCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
