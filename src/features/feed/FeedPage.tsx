import { Button } from '@heroui/react'

import { ArticleGrid, ArticleGridSkeleton } from '@/components/article'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProviderFailures } from '@/components/ui/ProviderFailures'
import { useArticles } from '@/hooks/useArticles'

const weekday = () => new Intl.DateTimeFormat('en-GB', { weekday: 'long' }).format(new Date())

export function FeedPage() {
  const { data, isPending, isError, refetch } = useArticles({})

  return (
    <>
      <PageHeader title={`${weekday()}'s briefing`} aside="Latest from your outlets" />
      {isPending ? (
        <ArticleGridSkeleton withLead />
      ) : isError ? (
        <EmptyState
          title="Your briefing didn't load"
          action={<Button onPress={() => refetch()}>Try again</Button>}
        >
          Check your connection, then try again.
        </EmptyState>
      ) : data.articles.length === 0 ? (
        <EmptyState title="No stories yet">
          None of your outlets have published anything recently.
        </EmptyState>
      ) : (
        <div className="grid gap-4">
          <ProviderFailures failures={data.failures} />
          <ArticleGrid articles={data.articles} withLead />
        </div>
      )}
    </>
  )
}
