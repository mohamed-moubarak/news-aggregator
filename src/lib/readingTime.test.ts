import { readingTime } from './readingTime'

describe('readingTime', () => {
  it('rounds to whole minutes with a one-minute floor', () => {
    expect(readingTime(920)).toBe('4 min read')
    expect(readingTime(40)).toBe('1 min read')
  })
  it('is undefined without a word count', () => {
    expect(readingTime(undefined)).toBeUndefined()
  })
})
