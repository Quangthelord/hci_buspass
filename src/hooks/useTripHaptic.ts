import { useEffect, useState } from 'react'
import { useMockRealtime } from '../lib/mockRealtime'
import {
  initAlertAudio,
  isSustainedAlertRunning,
  startSustainedAlert,
  stopSustainedAlert,
} from '../lib/sustainedAlert'

/**
 * Rung dài + tiếng kêu khi xe gần/đến trạm — chỉ dừng khi người dùng bấm Dừng.
 */
export function useTripHaptic(routeId: string) {
  const [armed, setArmed] = useState(false)
  const [alertStopped, setAlertStopped] = useState(false)
  const [alerting, setAlerting] = useState(false)

  const { distanceM, urgencyLevel, busDeparted } = useMockRealtime(armed ? routeId : '01')

  const level = armed ? urgencyLevel : 0
  const isArriving = alerting && !alertStopped && urgencyLevel >= 3

  useEffect(() => {
    if (!armed || alertStopped) return
    if (urgencyLevel >= 2) setAlerting(true)
  }, [armed, alertStopped, urgencyLevel])

  useEffect(() => {
    if (alerting && !alertStopped) {
      if (!isSustainedAlertRunning()) startSustainedAlert()
    } else {
      stopSustainedAlert()
    }
  }, [alerting, alertStopped])

  useEffect(() => () => stopSustainedAlert(), [])

  const armHaptic = () => {
    setArmed(true)
    setAlertStopped(false)
    setAlerting(false)
    initAlertAudio()
    if (navigator.vibrate) navigator.vibrate(40)
  }

  const stopAlert = () => {
    setAlertStopped(true)
    setAlerting(false)
    stopSustainedAlert()
  }

  return {
    level,
    isArriving,
    isAlerting: alerting && !alertStopped,
    distanceM,
    busDeparted,
    armed,
    alertStopped,
    armHaptic,
    stopAlert,
    canVibrate: typeof navigator !== 'undefined' && !!navigator.vibrate,
  }
}
