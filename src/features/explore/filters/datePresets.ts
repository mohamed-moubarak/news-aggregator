export interface DatePreset {
  id: string
  label: string
  /** Days back from today; the range ends today. */
  days: number
}

export const DATE_PRESETS: DatePreset[] = [
  { id: 'day', label: 'Past 24 hours', days: 1 },
  { id: 'week', label: 'Past week', days: 7 },
  { id: 'month', label: 'Past month', days: 30 },
]

const isoDay = (d: Date) => {
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 10)
}

export const presetRange = (preset: DatePreset, now = new Date()) => ({
  from: isoDay(new Date(now.getTime() - preset.days * 86_400_000)),
  to: isoDay(now),
})

/** The preset matching a range, if any (so the right option shows as selected). */
export const matchPreset = (from?: string, to?: string, now = new Date()) =>
  DATE_PRESETS.find((p) => {
    const r = presetRange(p, now)
    return r.from === from && r.to === to
  })
