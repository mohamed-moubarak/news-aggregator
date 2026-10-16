import { Button, Skeleton } from '@heroui/react'
import { useCallback } from 'react'
import { useLocation } from 'react-router'

import { ResultRow } from '@/components/article'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadMore } from '@/components/ui/LoadMore'
import { ProviderFailures } from '@/components/ui/ProviderFailures'
import { useInfiniteArticles } from '@/hooks/useInfiniteArticles'

import { ActiveFilters } from './ActiveFilters'
import { FilterPanel } from './filters/FilterPanel'
import { MobileFilters } from './MobileFilters'
import { SearchBox } from './SearchBox'
import { countFilters } from './searchParams'
import { useSearchFilters } from './useSearchFilters'

function ResultsSkeleton() {
  return (
    <div className="grid gap-3" aria-busy="true" aria-label="Loading results">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="bg-surface grid grid-cols-[1fr_auto] gap-6 rounded-xl p-5">
          <div className="grid gap-2.5">
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="h-5 w-4/5 rounded" />
            <Skeleton className="h-4 w-full rounded" />
          </div>
          <Skeleton className="size-20 rounded-lg md:h-24 md:w-36" />
        </div>
      ))}
    </div>
  )
}

export function ExplorePage() {
  const { filters, update, clearFilters } = useSearchFilters()
  const focusSearch = (useLocation().state as { focusSearch?: boolean } | null)?.focusSearch
  const results = useInfiniteArticles(filters)
  const hasFilters = countFilters(filters) > 0
  // Stable so the search box's debounce timer isn't reset by unrelated re-renders.
  const onSearch = useCallback(
    (keyword: string | undefined) => update({ keyword }, { replace: true }),
    [update],
  )
  const resultCount = results.isPending
    ? undefined
    : `${results.articles.length}${results.hasNextPage ? '+' : ''}`

  const heading = filters.keyword ? `“${filters.keyword}”` : 'Latest news'

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:gap-10">
      <aside className="hidden lg:block" aria-label="Filters">
        <div className="bg-surface sticky top-24 rounded-xl p-4">
          <FilterPanel filters={filters} onChange={update} />
        </div>
      </aside>

      <section className="grid min-w-0 content-start gap-4" aria-labelledby="results-heading">
        <div className="flex gap-2.5">
          <SearchBox value={filters.keyword} onSearch={onSearch} autoFocus={focusSearch} />
          <MobileFilters
            filters={filters}
            onChange={update}
            onClear={clearFilters}
            resultCount={resultCount}
          />
        </div>

        <header className="flex flex-wrap items-baseline gap-x-4 gap-y-1 pt-2">
          <h1
            id="results-heading"
            className="font-serif text-[28px] leading-tight font-medium md:text-[32px]"
          >
            {heading}
          </h1>
          {!results.isPending && !results.isError && (
            <span className="text-muted text-sm" aria-live="polite">
              {resultCount} articles
            </span>
          )}
        </header>

        <ActiveFilters filters={filters} onChange={update} onClear={clearFilters} />

        {results.isPending ? (
          <ResultsSkeleton />
        ) : results.isError ? (
          <EmptyState
            title="Search didn't load"
            action={<Button onPress={() => results.refetch()}>Try again</Button>}
          >
            Check your connection, then try again.
          </EmptyState>
        ) : results.articles.length === 0 ? (
          <EmptyState
            title="No articles match"
            action={
              hasFilters && (
                <Button variant="secondary" onPress={clearFilters}>
                  Clear filters
                </Button>
              )
            }
          >
            {hasFilters
              ? 'Try removing a filter or widening the date range.'
              : 'Try a different keyword.'}
          </EmptyState>
        ) : (
          <>
            <ProviderFailures failures={results.failures} />
            <div className="grid gap-3">
              {results.articles.map((a) => (
                <ResultRow key={a.id} article={a} keyword={filters.keyword} />
              ))}
            </div>
            <LoadMore
              hasMore={!!results.hasNextPage}
              isLoading={results.isFetchingNextPage}
              onLoadMore={() => results.fetchNextPage()}
            />
          </>
        )}
      </section>
    </div>
  )
}
