const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto', style: 'narrow' })
const dateFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' })

/** Compact relative time ("5m ago", "yesterday"); older than four weeks shows "12 Oct". */
export function timeAgo(iso: string, now = Date.now()): string {
  const minutes = (now - new Date(iso).getTime()) / 60_000
  const hours = minutes / 60
  const days = hours / 24
  if (minutes < 1) return 'just now'
  if (minutes < 60) return rtf.format(-Math.floor(minutes), 'minute')
  if (hours < 24) return rtf.format(-Math.floor(hours), 'hour')
  if (days < 7) return rtf.format(-Math.floor(days), 'day')
  if (days < 28) return rtf.format(-Math.floor(days / 7), 'week')
  return dateFmt.format(new Date(iso))
}
