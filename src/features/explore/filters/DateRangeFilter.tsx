import { Button, Popover, RangeCalendar } from '@heroui/react'
import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { CalendarDays } from 'lucide-react'
import { useId, useState } from 'react'

import { ToggleChip } from '@/components/ui/ToggleChip'

import { DATE_PRESETS, matchPreset, presetRange } from './datePresets'

const dayMonth = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})
const formatRange = (from: string, to: string) =>
  dayMonth.formatRange(new Date(`${from}T00:00:00`), new Date(`${to}T00:00:00`))

interface DateRangeFilterProps {
  from?: string
  to?: string
  onChange: (range: { from?: string; to?: string }) => void
}

/**
 * Range calendar in a popover, opened from one compact trigger. (Inline
 * mm/dd/yyyy fields don't fit the narrow filter panel.)
 */
function CustomRange({ from, to, onChange }: DateRangeFilterProps) {
  const [open, setOpen] = useState(false)
  // The panel renders twice (sidebar + mobile sheet), so ids must be unique.
  const id = useId()
  const value = from && to ? { start: parseDate(from), end: parseDate(to) } : null

  return (
    <div className="grid gap-1.5">
      <span id={`${id}-label`} className="text-muted text-xs">
        Custom range
      </span>
      <Popover isOpen={open} onOpenChange={setOpen}>
        <Button
          variant="outline"
          aria-labelledby={`${id}-label ${id}-value`}
          className="h-11 w-full min-w-0 justify-between rounded-xl px-3.5 text-sm font-normal"
        >
          <span id={`${id}-value`} className={`truncate ${value ? '' : 'text-field-placeholder'}`}>
            {value ? formatRange(from!, to!) : 'Choose dates'}
          </span>
          <CalendarDays className="text-muted size-4 shrink-0" aria-hidden />
        </Button>
        <Popover.Content placement="bottom start">
          <Popover.Dialog aria-label="Choose a date range" className="p-2">
            <RangeCalendar
              aria-label="Date range"
              value={value}
              maxValue={today(getLocalTimeZone())}
              onChange={(range) => {
                onChange({ from: range.start.toString(), to: range.end.toString() })
                setOpen(false)
              }}
            >
              <RangeCalendar.Header>
                <RangeCalendar.YearPickerTrigger>
                  <RangeCalendar.YearPickerTriggerHeading />
                  <RangeCalendar.YearPickerTriggerIndicator />
                </RangeCalendar.YearPickerTrigger>
                <RangeCalendar.NavButton slot="previous" />
                <RangeCalendar.NavButton slot="next" />
              </RangeCalendar.Header>
              <RangeCalendar.Grid>
                <RangeCalendar.GridHeader>
                  {(day) => <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>}
                </RangeCalendar.GridHeader>
                <RangeCalendar.GridBody>
                  {(date) => <RangeCalendar.Cell date={date} />}
                </RangeCalendar.GridBody>
              </RangeCalendar.Grid>
              <RangeCalendar.YearPickerGrid>
                <RangeCalendar.YearPickerGridBody>
                  {({ year }) => <RangeCalendar.YearPickerCell year={year} />}
                </RangeCalendar.YearPickerGridBody>
              </RangeCalendar.YearPickerGrid>
            </RangeCalendar>
          </Popover.Dialog>
        </Popover.Content>
      </Popover>
    </div>
  )
}

export function DateRangeFilter({ from, to, onChange }: DateRangeFilterProps) {
  const active = matchPreset(from, to)
  return (
    <div className="grid gap-2.5">
      <div role="group" aria-label="Date" className="flex flex-wrap gap-2">
        <span className="w-full text-sm font-semibold">Date</span>
        <ToggleChip
          selected={!from && !to}
          onToggle={() => onChange({ from: undefined, to: undefined })}
        >
          Any time
        </ToggleChip>
        {DATE_PRESETS.map((p) => (
          <ToggleChip
            key={p.id}
            selected={active?.id === p.id}
            onToggle={() => onChange(presetRange(p))}
          >
            {p.label}
          </ToggleChip>
        ))}
      </div>
      <CustomRange from={from} to={to} onChange={onChange} />
    </div>
  )
}
