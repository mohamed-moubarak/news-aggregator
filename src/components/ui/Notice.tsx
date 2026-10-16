import { TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'

/** Inline, non-blocking notice (e.g. one provider failed while others loaded). */
export function Notice({ children }: { children: ReactNode }) {
  return (
    <div
      role="status"
      className="bg-warning-soft text-warning-soft-foreground flex items-start gap-2.5 rounded-xl px-4 py-3 text-[13px]"
    >
      <TriangleAlert className="mt-px size-4 shrink-0" aria-hidden />
      <p>{children}</p>
    </div>
  )
}
