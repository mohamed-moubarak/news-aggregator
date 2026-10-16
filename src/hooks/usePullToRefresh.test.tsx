import { act, fireEvent, render, screen } from '@testing-library/react'

import { PullToRefresh } from '@/components/ui/PullToRefresh'

import { resist } from './usePullToRefresh'

const touch = (type: 'touchStart' | 'touchMove' | 'touchEnd', y: number) =>
  fireEvent[type](window, { touches: [{ clientY: y }] })

beforeEach(() => {
  vi.stubGlobal('matchMedia', (q: string) => ({ matches: q === '(pointer: coarse)' }))
})
afterEach(() => vi.unstubAllGlobals())

it('applies resistance and caps the pull', () => {
  expect(resist(-20)).toBe(0)
  expect(resist(100)).toBe(50)
  expect(resist(1000)).toBe(96)
})

it('refreshes after a long enough pull from the top', async () => {
  const onRefresh = vi.fn(() => Promise.resolve())
  render(<PullToRefresh onRefresh={onRefresh} />)

  touch('touchStart', 100)
  touch('touchMove', 260)
  expect(screen.getByText('Release to refresh')).toBeInTheDocument()
  await act(async () => {
    touch('touchEnd', 260)
  })
  expect(onRefresh).toHaveBeenCalledTimes(1)
})

it('ignores short pulls', () => {
  const onRefresh = vi.fn(() => Promise.resolve())
  render(<PullToRefresh onRefresh={onRefresh} />)
  touch('touchStart', 100)
  touch('touchMove', 150)
  expect(screen.getByText('Pull to refresh')).toBeInTheDocument()
  touch('touchEnd', 150)
  expect(onRefresh).not.toHaveBeenCalled()
})
