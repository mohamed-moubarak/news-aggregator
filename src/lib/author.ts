/** Desk or wire bylines that aren't a person you can follow. */
const GENERIC_BYLINE =
  /\b(staff|team|desk|agencies|agency|reporters?|newsroom|editors?|correspondents?)\b/i

/**
 * First individual name in a byline: "Robert Mackey (now); Gabrielle Canon" →
 * "Robert Mackey". Used as the followable author.
 */
export function primaryAuthor(byline: string | undefined): string | undefined {
  const first = byline
    ?.split(/;|,|\s+and\s+|\s+&\s+/i)[0]
    ?.replace(/\(.*?\)/g, '')
    .replace(/\s+in\s+[A-Z][\w\s.]*$/, '') // "Jane Doe in Kyiv"
    .trim()
  return first && !GENERIC_BYLINE.test(first) ? first : undefined
}

export const sameAuthor = (a: string, b: string) =>
  a.trim().toLowerCase() === b.trim().toLowerCase()
