import type { ReactNode } from 'react'

interface ToggleChipProps {
  selected: boolean
  onToggle: () => void
  children: ReactNode
  size?: 'md' | 'lg'
}

/** Pill-shaped toggle button (aria-pressed), used for topics and quick options. */
export function ToggleChip({ selected, onToggle, children, size = 'md' }: ToggleChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={`rounded-full border font-medium transition-colors ${
        size === 'lg' ? 'min-h-11 px-4 text-sm' : 'min-h-9 px-3 text-[13px]'
      } ${
        selected
          ? 'bg-accent-soft text-accent-soft-foreground border-transparent'
          : 'border-border bg-surface hover:bg-default'
      }`}
    >
      {children}
    </button>
  )
}
