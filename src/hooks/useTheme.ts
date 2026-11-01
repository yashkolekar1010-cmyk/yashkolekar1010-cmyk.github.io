import { useCallback, useEffect, useState } from 'react'

export type Theme = 'dark' | 'light'

/**
 * The initial value is already on <html> — index.html sets it before first
 * paint so the page never flashes the wrong theme. This hook just keeps
 * React in sync and broadcasts changes, which the WebGL scene listens for
 * to re-read its colours.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(
    () => (document.documentElement.getAttribute('data-theme') as Theme) || 'dark',
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('yk-theme', theme)
    } catch {
      /* private mode — the attribute above is enough */
    }
    window.dispatchEvent(new CustomEvent('yk-themechange'))
  }, [theme])

  const toggle = useCallback(
    () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    [],
  )

  return { theme, toggle }
}
