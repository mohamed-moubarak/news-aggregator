import { CheckboxGroup, Label } from '@heroui/react'

import { CATEGORIES, isCategoryId, type CategoryId } from '@/domain'

import { CheckboxOption } from './CheckboxOption'

interface CategoryPickerProps {
  label?: string
  value: CategoryId[] | undefined
  onChange: (categories: CategoryId[] | undefined) => void
}

export function CategoryPicker({ label = 'Category', value = [], onChange }: CategoryPickerProps) {
  return (
    <CheckboxGroup
      value={value}
      onChange={(next) => {
        const ids = next.filter(isCategoryId)
        onChange(ids.length ? ids : undefined)
      }}
      className="gap-0"
    >
      <Label className="mb-1 text-sm font-semibold">{label}</Label>
      {CATEGORIES.map((c) => (
        <CheckboxOption key={c.id} value={c.id} label={c.label} />
      ))}
    </CheckboxGroup>
  )
}
