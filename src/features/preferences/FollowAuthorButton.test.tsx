import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { FollowAuthorButton } from './FollowAuthorButton'
import { INITIAL_PREFERENCES, usePreferences } from './preferencesStore'

beforeEach(() => usePreferences.setState(INITIAL_PREFERENCES))

it('toggles following an author', async () => {
  render(<FollowAuthorButton author="Jane Doe" />)
  await userEvent.click(screen.getByRole('button', { name: 'Follow Jane Doe' }))
  expect(usePreferences.getState().authors).toEqual(['Jane Doe'])

  const following = screen.getByRole('button', { name: 'Following Jane Doe' })
  expect(following).toHaveAttribute('aria-pressed', 'true')
  await userEvent.click(following)
  expect(usePreferences.getState().authors).toEqual([])
})
