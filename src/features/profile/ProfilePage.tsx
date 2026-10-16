import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'

export function ProfilePage() {
  return (
    <>
      <PageHeader title="Your feed" />
      <EmptyState title="Preferences are on their way">
        Choose the outlets, categories and authors that shape your briefing.
      </EmptyState>
    </>
  )
}
