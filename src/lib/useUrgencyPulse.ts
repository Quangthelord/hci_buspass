import { useEffect, useRef } from 'react'
import { useMockRealtime, type UrgencyLevel } from './mockRealtime'

export type { UrgencyLevel }

function playChime() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.frequency.value = 880
    gain.gain.value = 0.08
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.15)
    setTimeout(() => ctx.close(), 300)
  } catch {
    /* optional audio */
  }
}

export function useUrgencyPulse(enabled = true, activeRouteId = '01') {
  const { distanceM, urgencyLevel, busDeparted } = useMockRealtime(
    enabled ? activeRouteId : '01',
  )
  const lastLevel = useRef<UrgencyLevel>(0)
  const lastDeparted = useRef(false)
  const vibrateInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!enabled || typeof navigator === 'undefined' || !navigator.vibrate) return

    if (vibrateInterval.current) {
      clearInterval(vibrateInterval.current)
      vibrateInterval.current = null
    }

    if (urgencyLevel === 2) {
      navigator.vibrate([300, 1700])
      vibrateInterval.current = setInterval(() => {
        navigator.vibrate([300, 1700])
      }, 2000)
      if (lastLevel.current < 2) playChime()
    } else if (urgencyLevel === 3) {
      navigator.vibrate(2000)
      if (lastLevel.current < 3) playChime()
    }

    lastLevel.current = urgencyLevel

    return () => {
      if (vibrateInterval.current) clearInterval(vibrateInterval.current)
      navigator.vibrate(0)
    }
  }, [urgencyLevel, enabled])

  /** D6 spec — single 3s haptic when bus pulls in / departs (xuống bến). */
  useEffect(() => {
    if (!enabled || typeof navigator === 'undefined' || !navigator.vibrate) return
    if (busDeparted && !lastDeparted.current) {
      navigator.vibrate(3000)
      playChime()
    }
    lastDeparted.current = busDeparted
  }, [busDeparted, enabled])

  return {
    distanceM,
    level: enabled ? urgencyLevel : (0 as UrgencyLevel),
    isArriving: enabled && urgencyLevel === 3,
    busDeparted,
  }
}
