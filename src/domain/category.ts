/** App-wide categories. Each provider maps these onto its own taxonomy. */
export const CATEGORIES = [
  { id: 'general', label: 'World' },
  { id: 'business', label: 'Business' },
  { id: 'technology', label: 'Technology' },
  { id: 'science', label: 'Science' },
  { id: 'health', label: 'Health' },
  { id: 'sports', label: 'Sports' },
  { id: 'entertainment', label: 'Culture' },
] as const

export type CategoryId = (typeof CATEGORIES)[number]['id']

export const isCategoryId = (value: string): value is CategoryId =>
  CATEGORIES.some((c) => c.id === value)
