import { SearchField } from '@heroui/react'
import { useEffect, useState } from 'react'

import { SEARCH_INPUT_ID } from './searchInputId'

const DEBOUNCE_MS = 400

interface SearchBoxProps {
  value: string | undefined
  onSearch: (keyword: string | undefined) => void
  autoFocus?: boolean
}

/** Keyword input that commits to the URL after typing pauses (or on Enter). */
export function SearchBox({ value = '', onSearch, autoFocus }: SearchBoxProps) {
  const [draft, setDraft] = useState(value)
  const [synced, setSynced] = useState(value)

  // Follow external changes (back/forward, shared links) without an effect.
  if (value !== synced) {
    setSynced(value)
    setDraft(value)
  }

  useEffect(() => {
    if (draft.trim() === value) return
    const id = setTimeout(() => onSearch(draft.trim() || undefined), DEBOUNCE_MS)
    return () => clearTimeout(id)
  }, [draft, value, onSearch])

  return (
    <SearchField
      aria-label="Search news"
      value={draft}
      onChange={setDraft}
      onSubmit={(v) => onSearch(v.trim() || undefined)}
      autoFocus={autoFocus}
      className="w-full"
    >
      <SearchField.Group className="h-12 rounded-xl">
        <SearchField.SearchIcon />
        <SearchField.Input
          id={SEARCH_INPUT_ID}
          placeholder="Search news by keyword"
          className="text-base"
        />
        <SearchField.ClearButton />
      </SearchField.Group>
    </SearchField>
  )
}
