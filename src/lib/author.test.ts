import { primaryAuthor, sameAuthor } from './author'

describe('primaryAuthor', () => {
  it.each([
    ['Jane Doe', 'Jane Doe'],
    ['Robert Mackey (now); Gabrielle Canon, Shrai Popat', 'Robert Mackey'],
    ['Tyler Pager and Anatoly Kurmanaev', 'Tyler Pager'],
    ['Andrew Roth in Kyiv', 'Andrew Roth'],
  ])('%s → %s', (input, expected) => {
    expect(primaryAuthor(input)).toBe(expected)
  })

  it.each(['Guardian staff', 'The Headlines Team', 'Reuters reporters'])(
    'ignores the generic byline %s',
    (byline) => expect(primaryAuthor(byline)).toBeUndefined(),
  )

  it('handles missing bylines', () => {
    expect(primaryAuthor(undefined)).toBeUndefined()
  })
})

it('compares authors case-insensitively', () => {
  expect(sameAuthor('jane doe ', 'Jane Doe')).toBe(true)
})
