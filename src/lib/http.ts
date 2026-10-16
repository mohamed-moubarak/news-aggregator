export class HttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

type Params = Record<string, string | number | undefined>

/** Builds a same-origin URL, dropping empty params. */
export function buildUrl(path: string, params: Params = {}): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') search.set(key, String(value))
  }
  const qs = search.toString()
  return qs ? `${path}?${qs}` : path
}

export async function getJson<T>(path: string, params?: Params, signal?: AbortSignal): Promise<T> {
  const res = await fetch(buildUrl(path, params), { signal })
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null
    throw new HttpError(res.status, body?.message ?? `Request failed with status ${res.status}`)
  }
  return res.json() as Promise<T>
}
