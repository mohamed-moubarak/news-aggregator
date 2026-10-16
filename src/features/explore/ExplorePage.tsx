import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'

export function ExplorePage() {
  return (
    <>
      <PageHeader title="Explore" />
      <EmptyState title="Search is on its way">
        Search by keyword and filter by date, category and outlet.
      </EmptyState>
    </>
  )
}
