import { Checkbox } from '@heroui/react'
import type { ReactNode } from 'react'

/** One row in a filter CheckboxGroup; 44px tall for touch. */
interface CheckboxOptionProps {
  value: string
  /** Accessible name, since children may include decoration. */
  label: string
  children?: ReactNode
}

export function CheckboxOption({ value, label, children = label }: CheckboxOptionProps) {
  return (
    <Checkbox value={value} aria-label={label} className="min-h-11 w-full">
      <Checkbox.Content className="w-full text-sm">
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
        {children}
      </Checkbox.Content>
    </Checkbox>
  )
}
