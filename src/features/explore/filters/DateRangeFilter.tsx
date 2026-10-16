import { DateRangePicker, Label, RangeCalendar } from '@heroui/react'
import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { CalendarDays } from 'lucide-react'

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

export function DateRangeFilter({ from, to, onChange }: DateRangeFilterProps) {
  const value = from && to ? { start: parseDate(from), end: parseDate(to) } : null
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
      <DateRangePicker
        value={value}
        maxValue={today(getLocalTimeZone())}
        onChange={(range) => onChange({ from: range?.start.toString(), to: range?.end.toString() })}
        className="w-full"
      >
        <Label className="text-muted text-xs">Custom range</Label>
        {/* A single trigger instead of inline mm/dd/yyyy fields, which don't fit narrow panels. */}
        <DateRangePicker.Trigger className="border-field-border bg-field text-field-foreground hover:bg-field-hover flex h-11 w-full min-w-0 items-center justify-between gap-2 rounded-xl border px-3.5 text-sm">
          <span className={`truncate ${value ? '' : 'text-field-placeholder'}`}>
            {value ? formatRange(from!, to!) : 'Choose dates'}
          </span>
          <CalendarDays className="text-muted size-4 shrink-0" aria-hidden />
        </DateRangePicker.Trigger>
        <DateRangePicker.Popover>
          <RangeCalendar aria-label="Date range">
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
        </DateRangePicker.Popover>
      </DateRangePicker>
    </div>
  )
}
