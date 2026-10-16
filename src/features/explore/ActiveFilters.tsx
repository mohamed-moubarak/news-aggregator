import { X } from 'lucide-react'

import { useOutlets } from '@/hooks/useOutlets'
import { categoryLabel } from '@/lib/categoryLabel'

import type { SearchFilters } from './searchParams'

const dayMonth = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' })
const fmt = (iso: string) => dayMonth.format(new Date(`${iso}T00:00:00`))

interface ActiveFiltersProps {
  filters: SearchFilters
  onChange: (patch: Partial<SearchFilters>) => void
  onClear: () => void
}

interface Chip {
  key: string
  label: string
  remove: () => void
}

function RemovableChip({ label, remove }: Omit<Chip, 'key'>) {
  return (
    <button
      type="button"
      onClick={remove}
      aria-label={`Remove filter: ${label}`}
      className="bg-accent-soft text-accent-soft-foreground hover:bg-accent-soft-hover inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium"
    >
      {label}
      <X className="size-3.5 opacity-70" aria-hidden />
    </button>
  )
}

/** Removable chips for every active filter, plus "Clear all". */
export function ActiveFilters({ filters, onChange, onClear }: ActiveFiltersProps) {
  const { data } = useOutlets()
  const outletName = (id: string) => data?.outlets.find((o) => o.id === id)?.name ?? id

  const chips: Chip[] = []
  if (filters.from || filters.to) {
    const label =
      filters.from && filters.to
        ? `${fmt(filters.from)} – ${fmt(filters.to)}`
        : filters.from
          ? `From ${fmt(filters.from)}`
          : `Until ${fmt(filters.to!)}`
    chips.push({ key: 'date', label, remove: () => onChange({ from: undefined, to: undefined }) })
  }
  for (const id of filters.categories ?? []) {
    chips.push({
      key: `cat-${id}`,
      label: categoryLabel(id) ?? id,
      remove: () => onChange({ categories: filters.categories?.filter((c) => c !== id) }),
    })
  }
  for (const id of filters.outletIds ?? []) {
    chips.push({
      key: `src-${id}`,
      label: outletName(id),
      remove: () => onChange({ outletIds: filters.outletIds?.filter((o) => o !== id) }),
    })
  }

  if (!chips.length) return null
  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Active filters">
      {chips.map(({ key, ...chip }) => (
        <RemovableChip key={key} {...chip} />
      ))}
      <button
        type="button"
        onClick={onClear}
        className="text-muted hover:text-foreground min-h-9 px-2 text-[13px] font-medium underline-offset-4 hover:underline"
      >
        Clear all
      </button>
    </div>
  )
}
