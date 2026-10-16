import { DateField, DateRangePicker, Label, RangeCalendar } from '@heroui/react'
import { getLocalTimeZone, parseDate, today } from '@internationalized/date'

import { DATE_PRESETS, matchPreset, presetRange } from './datePresets'

interface DateRangeFilterProps {
  from?: string
  to?: string
  onChange: (range: { from?: string; to?: string }) => void
}

export function DateRangeFilter({ from, to, onChange }: DateRangeFilterProps) {
  const value = from && to ? { start: parseDate(from), end: parseDate(to) } : null
  const active = matchPreset(from, to)
  const option = (selected: boolean) =>
    `min-h-9 rounded-full border px-3 text-[13px] font-medium transition-colors ${
      selected
        ? 'bg-accent-soft text-accent-soft-foreground border-transparent'
        : 'border-border hover:bg-default'
    }`

  return (
    <div className="grid gap-2.5">
      <div role="group" aria-label="Date" className="flex flex-wrap gap-2">
        <span className="w-full text-sm font-semibold">Date</span>
        <button
          type="button"
          aria-pressed={!from && !to}
          className={option(!from && !to)}
          onClick={() => onChange({ from: undefined, to: undefined })}
        >
          Any time
        </button>
        {DATE_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={active?.id === p.id}
            className={option(active?.id === p.id)}
            onClick={() => onChange(presetRange(p))}
          >
            {p.label}
          </button>
        ))}
      </div>
      <DateRangePicker
        value={value}
        maxValue={today(getLocalTimeZone())}
        onChange={(range) => onChange({ from: range?.start.toString(), to: range?.end.toString() })}
        className="w-full"
      >
        <Label className="text-muted text-xs">Custom range</Label>
        <DateField.Group fullWidth className="min-w-0 text-[13px]">
          <DateField.Input slot="start">
            {(segment) => <DateField.Segment segment={segment} />}
          </DateField.Input>
          <DateRangePicker.RangeSeparator />
          <DateField.Input slot="end">
            {(segment) => <DateField.Segment segment={segment} />}
          </DateField.Input>
          <DateField.Suffix>
            <DateRangePicker.Trigger>
              <DateRangePicker.TriggerIndicator />
            </DateRangePicker.Trigger>
          </DateField.Suffix>
        </DateField.Group>
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
