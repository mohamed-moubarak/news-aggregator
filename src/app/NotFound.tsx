import { Link } from 'react-router'

import { EmptyState } from '@/components/ui/EmptyState'

export function NotFound() {
  return (
    <EmptyState
      title="This page doesn't exist"
      action={
        <Link to="/" className="text-accent font-medium underline-offset-4 hover:underline">
          Go to your briefing
        </Link>
      }
    />
  )
}
