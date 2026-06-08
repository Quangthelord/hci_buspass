import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const TAP_COUNT = 3
const TAP_WINDOW_MS = 1000

/** Triple-tap top-right corner within 1s → navigate to /admin */
export function useAdminGesture() {
  const navigate = useNavigate()
  const tapCount = useRef(0)
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetTaps = useCallback(() => {
    tapCount.current = 0
    if (tapTimer.current) {
      clearTimeout(tapTimer.current)
      tapTimer.current = null
    }
  }, [])

  const onAdminHotspotTap = useCallback(() => {
    tapCount.current += 1

    if (!tapTimer.current) {
      tapTimer.current = setTimeout(resetTaps, TAP_WINDOW_MS)
    }

    if (tapCount.current >= TAP_COUNT) {
      resetTaps()
      navigate('/admin')
    }
  }, [navigate, resetTaps])

  return { onAdminHotspotTap }
}
