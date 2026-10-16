import { cleanAuthor, stripHtml } from './text'

describe('stripHtml', () => {
  it('removes tags and collapses whitespace', () => {
    expect(stripHtml('<p>Hello  <strong>world</strong></p>')).toBe('Hello world')
  })
  it('returns undefined for empty input', () => {
    expect(stripHtml('<p> </p>')).toBeUndefined()
    expect(stripHtml(undefined)).toBeUndefined()
  })
})

describe('cleanAuthor', () => {
  it('drops the "By" prefix', () => {
    expect(cleanAuthor('By Jane Doe')).toBe('Jane Doe')
  })
  it('rejects URL-only bylines', () => {
    expect(cleanAuthor('https://www.facebook.com/bbcnews')).toBeUndefined()
  })
  it('handles null', () => {
    expect(cleanAuthor(null)).toBeUndefined()
  })
})
