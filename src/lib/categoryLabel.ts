import { CATEGORIES, type CategoryId } from '@/domain'

export const categoryLabel = (id: CategoryId | undefined) =>
  CATEGORIES.find((c) => c.id === id)?.label
