import type { ProviderFailure } from '@/services'

import { Notice } from './Notice'

const list = (names: string[]) =>
  names.length < 2 ? (names[0] ?? '') : `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`

/** Explains which sources are missing so partial results aren't mistaken for complete ones. */
export function ProviderFailures({ failures }: { failures: ProviderFailure[] }) {
  if (!failures.length) return null
  const names = failures.map((f) => f.providerName)
  return (
    <Notice>
      Articles from {list(names)} couldn't be loaded, so they're missing below. Try again in a
      minute.
    </Notice>
  )
}
