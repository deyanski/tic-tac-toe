import { useState, useEffect } from 'react'

type ThemeMode = 'light' | 'dark'
const VALID_THEMES: ThemeMode[] = ['light', 'dark']
const STORAGE_KEY = 'ttt-theme'

function getSystemTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function readStoredTheme(): ThemeMode | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && (VALID_THEMES as string[]).includes(stored)) {
      return stored as ThemeMode
    }
    return null
  } catch {
    // localStorage unavailable (private browsing, quota exceeded, etc.)
    return null
  }
}

function writeStoredTheme(theme: ThemeMode): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Silently ignore write failures
  }
}

function applyTheme(theme: ThemeMode): void {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const stored = readStoredTheme()
    return stored ?? getSystemTheme()
  })

  // Apply on first render and whenever theme changes
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // Keep in sync if system preference changes while app is open
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      // Only follow system changes if user hasn't stored a preference
      if (readStoredTheme() === null) {
        const next: ThemeMode = e.matches ? 'dark' : 'light'
        setThemeState(next)
      }
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const toggleTheme = () => {
    const next: ThemeMode = theme === 'dark' ? 'light' : 'dark'
    setThemeState(next)
    writeStoredTheme(next)
  }

  return { theme, toggleTheme }
}
