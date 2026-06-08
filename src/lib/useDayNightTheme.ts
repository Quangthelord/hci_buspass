import { useEffect, useState } from 'react'

export type ThemeMode = 'day' | 'night'

function getThemeFromHour(hour: number): ThemeMode {
  return hour >= 6 && hour < 18 ? 'day' : 'night'
}

/** Auto day/night: 06:00–18:00 day, 18:00–06:00 night. */
export function useDayNightTheme() {
  const [mode, setMode] = useState<ThemeMode>(() =>
    getThemeFromHour(new Date().getHours()),
  )

  useEffect(() => {
    const tick = () => setMode(getThemeFromHour(new Date().getHours()))
    tick()
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = mode
    document.body.classList.toggle('d6-night', mode === 'night')
    document.body.classList.toggle('d6-day', mode === 'day')
    return () => {
      document.body.classList.remove('d6-night', 'd6-day')
      delete document.documentElement.dataset.theme
    }
  }, [mode])

  return mode
}
