import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { CategoryId } from '@/domain'
import { sameAuthor } from '@/lib/author'

export interface Preferences {
  /** Empty means "use each provider's defaults". */
  outletIds: string[]
  categories: CategoryId[]
  authors: string[]
  /** Set once the first-visit picker is completed or skipped. */
  onboarded: boolean
}

interface PreferencesActions {
  setOutlets: (ids: string[]) => void
  setCategories: (ids: CategoryId[]) => void
  followAuthor: (name: string) => void
  unfollowAuthor: (name: string) => void
  completeOnboarding: (prefs?: Partial<Omit<Preferences, 'onboarded'>>) => void
  reset: () => void
}

export const INITIAL_PREFERENCES: Preferences = {
  outletIds: [],
  categories: [],
  authors: [],
  onboarded: false,
}

export type PreferencesState = Preferences & PreferencesActions

/** User preferences, persisted in localStorage (no backend). */
export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      ...INITIAL_PREFERENCES,
      setOutlets: (outletIds) => set({ outletIds }),
      setCategories: (categories) => set({ categories }),
      followAuthor: (name) =>
        set((s) => {
          const clean = name.trim()
          if (!clean || s.authors.some((a) => sameAuthor(a, clean))) return s
          return { authors: [...s.authors, clean] }
        }),
      unfollowAuthor: (name) =>
        set((s) => ({ authors: s.authors.filter((a) => !sameAuthor(a, name)) })),
      completeOnboarding: (prefs = {}) => set({ ...prefs, onboarded: true }),
      reset: () => set(INITIAL_PREFERENCES),
    }),
    {
      name: 'briefly:preferences',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ outletIds, categories, authors, onboarded }) => ({
        outletIds,
        categories,
        authors,
        onboarded,
      }),
    },
  ),
)

/** True when the user follows this author (case-insensitive). */
export const useIsFollowing = (name: string | undefined) =>
  usePreferences((s) => !!name && s.authors.some((a) => sameAuthor(a, name)))
