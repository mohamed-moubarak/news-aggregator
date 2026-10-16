import { CategoryPicker } from '@/components/pickers/CategoryPicker'
import { OutletPicker } from '@/components/pickers/OutletPicker'

import type { SearchFilters } from '../searchParams'
import { DateRangeFilter } from './DateRangeFilter'

interface FilterPanelProps {
  filters: SearchFilters
  onChange: (patch: Partial<SearchFilters>) => void
}

/** All filters; shared by the desktop sidebar and the mobile sheet. */
export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  return (
    <div className="grid gap-7">
      <DateRangeFilter from={filters.from} to={filters.to} onChange={onChange} />
      <CategoryPicker
        value={filters.categories}
        onChange={(categories) => onChange({ categories })}
      />
      <OutletPicker value={filters.outletIds} onChange={(outletIds) => onChange({ outletIds })} />
    </div>
  )
}
