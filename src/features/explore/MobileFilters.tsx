import { Button, Drawer } from '@heroui/react'
import { SlidersHorizontal } from 'lucide-react'

import { FilterPanel } from './filters/FilterPanel'
import { countFilters, type SearchFilters } from './searchParams'

interface MobileFiltersProps {
  filters: SearchFilters
  onChange: (patch: Partial<SearchFilters>) => void
  onClear: () => void
  resultCount?: number
}

/** Bottom sheet with the full filter panel; filters apply as they change. */
export function MobileFilters({ filters, onChange, onClear, resultCount }: MobileFiltersProps) {
  const count = countFilters(filters)
  return (
    <Drawer>
      <Button variant="secondary" className="h-12 shrink-0 rounded-xl lg:hidden">
        <SlidersHorizontal className="size-4" aria-hidden />
        Filters{count > 0 && ` (${count})`}
      </Button>
      <Drawer.Backdrop>
        <Drawer.Content placement="bottom">
          <Drawer.Dialog className="max-h-[88dvh]">
            <Drawer.Handle />
            <Drawer.Header>
              <Drawer.Heading>Filters</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
              <FilterPanel filters={filters} onChange={onChange} />
            </Drawer.Body>
            <Drawer.Footer className="grid grid-cols-[1fr_2fr] gap-2.5">
              <Button variant="secondary" onPress={onClear} isDisabled={count === 0}>
                Reset
              </Button>
              <Button slot="close">
                {resultCount === undefined ? 'Show results' : `Show ${resultCount} articles`}
              </Button>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  )
}
