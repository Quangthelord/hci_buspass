import { useState } from 'react'
import { useUrgencyPulse } from '../lib/useUrgencyPulse'

/**
 * Rung theo khoảng cách xe → trạm (mock realtime).
 * Cần một lần chạm người dùng trên iOS để kích hoạt Vibration API.
 */
export function useTripHaptic(routeId: string) {
  const [armed, setArmed] = useState(false)
  const { level, isArriving, distanceM, busDeparted } = useUrgencyPulse(armed, routeId)

  const armHaptic = () => {
    setArmed(true)
    if (navigator.vibrate) navigator.vibrate(40)
  }

  return {
    level,
    isArriving,
    distanceM,
    busDeparted,
    armed,
    armHaptic,
    canVibrate: typeof navigator !== 'undefined' && !!navigator.vibrate,
  }
}
