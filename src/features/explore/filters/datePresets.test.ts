import { DATE_PRESETS, matchPreset, presetRange } from './datePresets'

const now = new Date('2026-10-16T12:00:00')

describe('date presets', () => {
  it('builds ranges ending today', () => {
    expect(presetRange(DATE_PRESETS[1]!, now)).toEqual({ from: '2026-10-09', to: '2026-10-16' })
  })
  it('recognizes a range produced by a preset', () => {
    expect(matchPreset('2026-10-09', '2026-10-16', now)?.id).toBe('week')
    expect(matchPreset('2026-10-01', '2026-10-16', now)).toBeUndefined()
  })
})
