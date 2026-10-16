import { Button } from '@heroui/react'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Navigate } from 'react-router'

import { ArticleGrid, ArticleGridSkeleton } from '@/components/article'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadMore } from '@/components/ui/LoadMore'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProviderFailures } from '@/components/ui/ProviderFailures'
import { PullToRefresh } from '@/components/ui/PullToRefresh'
import { CATEGORIES, type ArticleQuery, type CategoryId } from '@/domain'
import { usePreferences } from '@/features/preferences/preferencesStore'
import { useInfiniteArticles } from '@/hooks/useInfiniteArticles'

import { FollowedAuthorsRow } from './FollowedAuthorsRow'
import { TopicChips } from './TopicChips'

const weekday = () => new Intl.DateTimeFormat('en-GB', { weekday: 'long' }).format(new Date())
const ALL_TOPICS = CATEGORIES.map((c) => c.id)

export function FeedPage() {
  const onboarded = usePreferences((s) => s.onboarded)
  const outletIds = usePreferences((s) => s.outletIds)
  const categories = usePreferences((s) => s.categories)
  const authors = usePreferences((s) => s.authors)
  const [topic, setTopic] = useState<CategoryId>()

  // Topic chips narrow the feed temporarily; otherwise use the followed topics.
  const query = useMemo<ArticleQuery>(
    () => ({
      outletIds: outletIds.length ? outletIds : undefined,
      categories: topic ? [topic] : categories.length ? categories : undefined,
    }),
    [outletIds, categories, topic],
  )
  const feed = useInfiniteArticles(query)
  const queryClient = useQueryClient()
  const refresh = () =>
    Promise.all([feed.refetch(), queryClient.refetchQueries({ queryKey: ['author-stories'] })])

  if (!onboarded) return <Navigate to="/welcome" replace />

  const source = outletIds.length
    ? `From ${outletIds.length} ${outletIds.length === 1 ? 'outlet' : 'outlets'} you follow`
    : 'Our picks from trusted outlets'

  return (
    <div className="grid gap-5 md:gap-7">
      <PullToRefresh onRefresh={refresh} />
      <div className="grid gap-4">
        <PageHeader title={`${weekday()}'s briefing`} aside={source} />
        <TopicChips
          topics={categories.length ? categories : ALL_TOPICS}
          selected={topic}
          onSelect={setTopic}
        />
      </div>

      <FollowedAuthorsRow authors={authors} />

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
        <EmptyState
          title="Nothing new here yet"
          action={
            topic && (
              <Button variant="secondary" onPress={() => setTopic(undefined)}>
                Show all topics
              </Button>
            )
          }
        >
          Your outlets haven't published anything{topic ? ' on this topic' : ''} recently. Try
          following more outlets from Your feed.
        </EmptyState>
      ) : (
        <div className="grid gap-4">
          <ProviderFailures failures={feed.failures} />
          {authors.length > 0 && <h2 className="sr-only">Latest from your outlets</h2>}
          <ArticleGrid articles={feed.articles} withLead />
          <LoadMore
            hasMore={!!feed.hasNextPage}
            isLoading={feed.isFetchingNextPage}
            onLoadMore={() => feed.fetchNextPage()}
          />
        </div>
      )}
    </div>
  )
}
