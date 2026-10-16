import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  children?: ReactNode
  action?: ReactNode
}

/** Centered message for empty and error states, with an optional next step. */
export function EmptyState({ title, children, action }: EmptyStateProps) {
  return (
    <div className="bg-surface mx-auto grid max-w-xl justify-items-center gap-3 rounded-xl px-6 py-14 text-center">
      <h2 className="font-serif text-2xl font-medium">{title}</h2>
      {children && <div className="text-muted text-[15px] leading-relaxed">{children}</div>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
