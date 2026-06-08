import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { busRoutesData } from '../data/busRoutes'
import { formatTime24 } from '../lib/formatVi'
import {
  getKioskOrientation,
  KIOSK_DIMENSIONS,
  type KioskOrientation,
} from '../lib/kioskDisplay'
import { resetRealtimeSimulator, stopRealtimeSimulator } from '../lib/mockRealtime'
import { abandonTask, getActiveTaskVariant, resetSessionId } from '../lib/telemetry'

const IDLE_MS = 60_000

export function KioskWrapper({ children }: { children: ReactNode }) {
  const [orientation, setOrientation] = useState<KioskOrientation>(getKioskOrientation)
  const [screensaver, setScreensaver] = useState(true)
  const [now, setNow] = useState(new Date())
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const stationName = busRoutesData.station.name
  const dims = KIOSK_DIMENSIONS[orientation]

  const resetIdle = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(() => {
      const variantId = getActiveTaskVariant()
      if (variantId) abandonTask(variantId)
      setScreensaver(true)
      stopRealtimeSimulator()
    }, IDLE_MS)
  }, [])

  const wakeSession = useCallback(() => {
    resetSessionId()
    resetRealtimeSimulator('01')
    setScreensaver(false)
    resetIdle()
  }, [resetIdle])

  useEffect(() => {
    const clock = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(clock)
  }, [])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'kioskOrientation') setOrientation(getKioskOrientation())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  useEffect(() => {
    if (!screensaver) resetIdle()
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [screensaver, resetIdle])

  useEffect(() => {
    if (screensaver) return

    const onActivity = () => resetIdle()
    window.addEventListener('pointerdown', onActivity)
    window.addEventListener('keydown', onActivity)
    return () => {
      window.removeEventListener('pointerdown', onActivity)
      window.removeEventListener('keydown', onActivity)
    }
  }, [screensaver, resetIdle])

  useEffect(() => () => stopRealtimeSimulator(), [])

  return (
    <div className="kiosk-bezel-outer">
      <div
        className={`kiosk-bezel-screen kiosk-bezel-screen--${orientation}`}
        style={{
          aspectRatio: `${dims.width} / ${dims.height}`,
          maxWidth: orientation === 'portrait' ? '1080px' : '1920px',
          maxHeight: orientation === 'portrait' ? '1920px' : '1080px',
        }}
      >
        {screensaver ? (
          <button
            type="button"
            className="kiosk-screensaver flex h-full w-full flex-col items-center justify-center gap-6"
            onClick={wakeSession}
          >
            <p className="kiosk-screensaver-label text-sm font-semibold uppercase tracking-widest">
              Trạm xe buýt
            </p>
            <h1 className="kiosk-screensaver-station font-bold">{stationName}</h1>
            <time className="kiosk-screensaver-time tabular-nums font-bold">
              {formatTime24(now)}
            </time>
            <p className="kiosk-screensaver-cta font-semibold">Chạm để bắt đầu</p>
          </button>
        ) : (
          <div className="kiosk-bezel-content h-full w-full overflow-hidden">{children}</div>
        )}
      </div>
    </div>
  )
}
