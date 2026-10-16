import { Link } from 'react-router'

import { ToggleChip } from '@/components/ui/ToggleChip'
import { CATEGORIES, type CategoryId } from '@/domain'

interface TopicChipsProps {
  /** Topics to offer; the user's followed topics, or all of them. */
  topics: CategoryId[]
  selected: CategoryId | undefined
  onSelect: (topic: CategoryId | undefined) => void
}

/** Quick, temporary topic narrowing for the feed (doesn't change preferences). */
export function TopicChips({ topics, selected, onSelect }: TopicChipsProps) {
  return (
    <div
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0"
      role="group"
      aria-label="Topics"
    >
      <ToggleChip selected={!selected} onToggle={() => onSelect(undefined)}>
        All
      </ToggleChip>
      {CATEGORIES.filter((c) => topics.includes(c.id)).map((c) => (
        <ToggleChip key={c.id} selected={selected === c.id} onToggle={() => onSelect(c.id)}>
          {c.label}
        </ToggleChip>
      ))}
      <Link
        to="/you"
        className="border-border text-accent hover:bg-default inline-flex min-h-9 shrink-0 items-center rounded-full border border-dashed px-3 text-[13px] font-medium"
      >
        Edit feed
      </Link>
    </div>
  )
}
