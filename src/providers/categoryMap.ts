import type { CategoryId } from '@/domain'

/** Maps app categories to provider-specific values (sections, desks, …). */
export type CategoryMap = Record<CategoryId, readonly string[]>

export const toProviderValues = (map: CategoryMap, categories: CategoryId[] = []): string[] =>
  categories.flatMap((c) => map[c])

/** Reverse lookup: first app category whose provider values include `value`. */
export const fromProviderValue = (map: CategoryMap, value: string | undefined) => {
  if (!value) return undefined
  const needle = value.toLowerCase()
  const match = Object.entries(map).find(([, values]) =>
    values.some((v) => v.toLowerCase() === needle),
  )
  return match?.[0] as CategoryId | undefined
}
