import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { SEARCH_INPUT_ID } from '@/features/explore/SearchBox'

export const isMac = () =>
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

/** ⌘K / Ctrl+K focuses search, opening Explore first if needed. */
export function useSearchShortcut() {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'k' || !(e.metaKey || e.ctrlKey)) return
      e.preventDefault()
      const input = document.getElementById(SEARCH_INPUT_ID)
      if (pathname === '/explore' && input) {
        input.focus()
        ;(input as HTMLInputElement).select()
      } else {
        navigate(
          { pathname: '/explore', search: pathname === '/explore' ? search : '' },
          {
            state: { focusSearch: true },
            viewTransition: true,
          },
        )
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate, pathname, search])
}
