import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'

import { routes } from './app/router'

const renderAt = (path: string) =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })} />
    </QueryClientProvider>,
  )

it('renders the shell with navigation', () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(() => new Promise(() => {})),
  )
  renderAt('/')
  expect(screen.getByRole('link', { name: 'Briefly home' })).toBeInTheDocument()
  expect(screen.getAllByRole('navigation', { name: 'Main' })).toHaveLength(2)
  expect(screen.getByLabelText('Loading articles')).toBeInTheDocument()
  vi.unstubAllGlobals()
})

it('shows a not-found state for unknown routes', () => {
  renderAt('/nope')
  expect(screen.getByText("This page doesn't exist")).toBeInTheDocument()
})
