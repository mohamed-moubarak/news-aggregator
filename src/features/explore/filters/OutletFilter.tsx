import { CheckboxGroup, Label, SearchField, Skeleton } from '@heroui/react'
import { useMemo, useState } from 'react'

import { useOutlets } from '@/hooks/useOutlets'
import { outletStyle } from '@/lib/outletColor'

import { CheckboxOption } from './CheckboxOption'

interface OutletFilterProps {
  value: string[] | undefined
  onChange: (outletIds: string[] | undefined) => void
}

/** Searchable outlet checklist; selected outlets float to the top. */
export function OutletFilter({ value = [], onChange }: OutletFilterProps) {
  const { data, isPending } = useOutlets()
  const [term, setTerm] = useState('')

  const outlets = useMemo(() => {
    const needle = term.trim().toLowerCase()
    const selected = new Set(value)
    return (data?.outlets ?? [])
      .filter((o) => !needle || o.name.toLowerCase().includes(needle))
      .sort((a, b) => Number(selected.has(b.id)) - Number(selected.has(a.id)))
  }, [data, term, value])

  return (
    <CheckboxGroup
      value={value}
      onChange={(next) => onChange(next.length ? next : undefined)}
      className="gap-2"
    >
      <Label className="text-sm font-semibold">Source</Label>
      <SearchField aria-label="Find an outlet" value={term} onChange={setTerm} variant="secondary">
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input placeholder="Find an outlet" />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>
      <div className="-mx-1 max-h-72 overflow-y-auto px-1">
        {isPending
          ? Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="my-3 h-4 rounded" />)
          : outlets.map((o) => (
              <CheckboxOption key={o.id} value={o.id} label={o.name}>
                <span className="flex-1 truncate">{o.name}</span>
                <span
                  aria-hidden
                  style={outletStyle(o.id)}
                  className="bg-spine size-2.5 shrink-0 rounded-[3px]"
                />
              </CheckboxOption>
            ))}
        {!isPending && outlets.length === 0 && (
          <p className="text-muted py-3 text-sm">No outlet matches “{term}”.</p>
        )}
      </div>
    </CheckboxGroup>
  )
}
