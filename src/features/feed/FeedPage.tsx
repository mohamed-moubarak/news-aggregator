import { Button } from '@heroui/react'

import { ArticleGrid, ArticleGridSkeleton } from '@/components/article'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadMore } from '@/components/ui/LoadMore'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProviderFailures } from '@/components/ui/ProviderFailures'
import { useInfiniteArticles } from '@/hooks/useInfiniteArticles'

const weekday = () => new Intl.DateTimeFormat('en-GB', { weekday: 'long' }).format(new Date())

const FEED_QUERY = {}

export function FeedPage() {
  const feed = useInfiniteArticles(FEED_QUERY)

  return (
    <>
      <PageHeader title={`${weekday()}'s briefing`} aside="Latest from your outlets" />
      {feed.isPending ? (
        <ArticleGridSkeleton withLead />
      ) : feed.isError ? (
        <EmptyState
          title="Your briefing didn't load"
          action={<Button onPress={() => feed.refetch()}>Try again</Button>}
        >
          Check your connection, then try again.
        </EmptyState>
      ) : feed.articles.length === 0 ? (
        <EmptyState title="No stories yet">
          None of your outlets have published anything recently.
        </EmptyState>
      ) : (
        <div className="grid gap-4">
          <ProviderFailures failures={feed.failures} />
          <ArticleGrid articles={feed.articles} withLead />
          <LoadMore
            hasMore={!!feed.hasNextPage}
            isLoading={feed.isFetchingNextPage}
            onLoadMore={() => feed.fetchNextPage()}
          />
        </div>
      )}
    </>
  )
}
