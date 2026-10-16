import { render } from '@testing-library/react'

import { highlight } from './highlight'

describe('highlight', () => {
  it('marks every keyword term, case-insensitively', () => {
    const { container } = render(
      <p>{highlight('Battery storage and grid storage', 'storage battery')}</p>,
    )
    expect([...container.querySelectorAll('mark')].map((m) => m.textContent)).toEqual([
      'Battery',
      'storage',
      'storage',
    ])
  })

  it('escapes regex characters and ignores one-letter terms', () => {
    const { container } = render(<p>{highlight('C++ (and a bit of C)', 'c++ a')}</p>)
    expect(container.querySelectorAll('mark')).toHaveLength(1)
  })

  it('returns plain text without a keyword', () => {
    expect(highlight('Plain', undefined)).toBe('Plain')
  })
})
