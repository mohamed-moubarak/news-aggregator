import type { SearchFilters } from '../searchParams'
import { CategoryFilter } from './CategoryFilter'
import { DateRangeFilter } from './DateRangeFilter'
import { OutletFilter } from './OutletFilter'

interface FilterPanelProps {
  filters: SearchFilters
  onChange: (patch: Partial<SearchFilters>) => void
}

/** All filters; shared by the desktop sidebar and the mobile sheet. */
export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  return (
    <div className="grid gap-7">
      <DateRangeFilter from={filters.from} to={filters.to} onChange={onChange} />
      <CategoryFilter
        value={filters.categories}
        onChange={(categories) => onChange({ categories })}
      />
      <OutletFilter value={filters.outletIds} onChange={(outletIds) => onChange({ outletIds })} />
    </div>
  )
}
