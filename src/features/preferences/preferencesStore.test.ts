import { INITIAL_PREFERENCES, usePreferences } from './preferencesStore'

beforeEach(() => {
  localStorage.clear()
  usePreferences.setState(INITIAL_PREFERENCES)
})

describe('preferences store', () => {
  it('follows authors once, case-insensitively, and unfollows them', () => {
    const { followAuthor, unfollowAuthor } = usePreferences.getState()
    followAuthor('Jane Doe')
    followAuthor(' jane doe ')
    expect(usePreferences.getState().authors).toEqual(['Jane Doe'])
    unfollowAuthor('JANE DOE')
    expect(usePreferences.getState().authors).toEqual([])
  })

  it('persists preferences to localStorage', () => {
    usePreferences.getState().setCategories(['science'])
    const saved = JSON.parse(localStorage.getItem('briefly:preferences') ?? '{}')
    expect(saved.state).toMatchObject({ categories: ['science'], onboarded: false })
  })

  it('completes onboarding with chosen preferences, and resets', () => {
    usePreferences.getState().completeOnboarding({ outletIds: ['bbc-news'] })
    expect(usePreferences.getState()).toMatchObject({ outletIds: ['bbc-news'], onboarded: true })
    usePreferences.getState().reset()
    expect(usePreferences.getState()).toMatchObject(INITIAL_PREFERENCES)
  })
})
