/** Spine colors as [light, dark] pairs; dark variants are lightened for contrast. */
type ColorPair = readonly [light: string, dark: string]

const KNOWN: Record<string, ColorPair> = {
  'the-guardian': ['#052962', '#6f96ea'],
  'the-new-york-times': ['#2e2e2e', '#8a93a3'],
  'bbc-news': ['#b80000', '#e2474b'],
  'the-verge': ['#5200ff', '#9b6bff'],
  'al-jazeera-english': ['#a87800', '#d9a521'],
  wired: ['#0f7b6c', '#2fae99'],
  cnn: ['#cc0000', '#f05050'],
  bloomberg: ['#6b2bd9', '#a57cf0'],
  'national-geographic': ['#b38f00', '#e0bb2a'],
  'associated-press': ['#c8102e', '#ee5a6d'],
  techcrunch: ['#028a0f', '#3cc24a'],
  espn: ['#b5121b', '#e8545b'],
}

const FALLBACK: ColorPair[] = [
  ['#1f5fa8', '#6aa5ea'],
  ['#8a3b9e', '#c486d6'],
  ['#0e7c86', '#3fbcc6'],
  ['#9c4a12', '#e08a4c'],
  ['#3d6b1f', '#82b95b'],
  ['#a3214f', '#e66a96'],
]

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7)

export const outletColor = (outletId: string): ColorPair =>
  KNOWN[outletId] ?? FALLBACK[Math.abs(hash(outletId)) % FALLBACK.length]!

/** CSS variables consumed by `bg-spine` / `text-spine` utilities. */
export const outletStyle = (outletId: string) => {
  const [light, dark] = outletColor(outletId)
  return { '--spine-light': light, '--spine-dark': dark } as React.CSSProperties
}
