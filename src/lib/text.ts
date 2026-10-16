/** Strips HTML tags and collapses whitespace (Guardian trailText contains markup). */
export const stripHtml = (html: string | undefined): string | undefined => {
  if (!html) return undefined
  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return text || undefined
}

/** Normalizes bylines: drops "By " prefixes and URL-only values some feeds return. */
export const cleanAuthor = (raw: string | null | undefined): string | undefined => {
  const value = raw
    ?.replace(/^by\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (!value || /^https?:\/\//i.test(value)) return undefined
  return value
}
