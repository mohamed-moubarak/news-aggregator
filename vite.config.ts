import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { loadEnv, type ProxyOptions } from 'vite'
import { defineConfig } from 'vitest/config'

/** Appends a query param to a proxied path, keeping existing params. */
const withParam = (path: string, key: string, value: string) =>
  `${path}${path.includes('?') ? '&' : '?'}${key}=${encodeURIComponent(value)}`

/**
 * Dev-server mirror of the nginx proxy: provider keys are injected server-side
 * and never reach the browser bundle.
 */
function apiProxy(env: Record<string, string>): Record<string, ProxyOptions> {
  return {
    '/api/guardian': {
      target: 'https://content.guardianapis.com',
      changeOrigin: true,
      rewrite: (p) =>
        withParam(p.replace(/^\/api\/guardian/, ''), 'api-key', env.GUARDIAN_API_KEY ?? ''),
    },
    '/api/nyt': {
      target: 'https://api.nytimes.com/svc/search/v2',
      changeOrigin: true,
      rewrite: (p) => withParam(p.replace(/^\/api\/nyt/, ''), 'api-key', env.NYT_API_KEY ?? ''),
    },
    '/api/newsapi': {
      target: 'https://newsapi.org/v2',
      changeOrigin: true,
      rewrite: (p) => p.replace(/^\/api\/newsapi/, ''),
      headers: { 'X-Api-Key': env.NEWSAPI_API_KEY ?? '' },
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    server: { proxy: apiProxy(env) },
    preview: { proxy: apiProxy(env) },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
      css: false,
    },
  }
})
