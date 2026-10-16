/** Stubs global fetch with a JSON body; returns the mock to inspect requested URLs. */
export function mockFetchJson(body: unknown, status = 200) {
  const mock = vi.fn(async () => new Response(JSON.stringify(body), { status }))
  vi.stubGlobal('fetch', mock)
  return mock
}

/** Parses the n-th requested URL into path + params. */
export function requestedUrl(mock: ReturnType<typeof mockFetchJson>, call = 0) {
  const url = new URL(String(mock.mock.calls[call]?.[0 as never]), 'http://localhost')
  return { path: url.pathname, params: Object.fromEntries(url.searchParams) }
}
