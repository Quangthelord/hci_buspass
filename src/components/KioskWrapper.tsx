import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { busRoutesData } from '../data/busRoutes'
import { formatTime24 } from '../lib/formatVi'
import { getKioskOrientation, type KioskOrientation } from '../lib/kioskDisplay'
import { resetRealtimeSimulator, stopRealtimeSimulator } from '../lib/mockRealtime'
import { resetKioskBodyTheme } from '../lib/kioskTheme'
import {
  abandonTask,
  getActiveTaskVariant,
  resetSessionId,
  setSessionVariant,
} from '../lib/telemetry'
import type { VariantId } from '../lib/variantConfig'
import { KioskFlowProvider, type KioskPhase } from '../context/KioskFlowContext'
import { useAdminGesture } from '../hooks/useAdminGesture'
import { useKioskMisclickTracker } from '../hooks/useKioskMisclickTracker'
import { KioskVariantRenderer } from './KioskVariantRenderer'
import { VariantPicker } from './VariantPicker'

const IDLE_MS = 60_000

function KioskActivePane({
  directChild,
  pickedVariant,
}: {
  directChild?: ReactNode
  pickedVariant: VariantId | null
}) {
  const userId = sessionStorage.getItem('buspass_userId') ?? 'participant-01'

  if (directChild) return <>{directChild}</>

  if (!pickedVariant) {
    return (
      <div className="kiosk-variant-error">
        <p className="kiosk-variant-error-title">Chưa chọn phiên bản</p>
      </div>
    )
  }

  return <KioskVariantRenderer variantId={pickedVariant} userId={userId} />
}

export function KioskWrapper({
  directChild,
  skipMenu = false,
}: {
  directChild?: ReactNode
  skipMenu?: boolean
}) {
  const { onAdminHotspotTap } = useAdminGesture()
  const [orientation, setOrientation] = useState<KioskOrientation>(getKioskOrientation)
  const [phase, setPhase] = useState<KioskPhase>('screensaver')
  const [pickedVariant, setPickedVariant] = useState<VariantId | null>(null)
  const [now, setNow] = useState(new Date())
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const stationName = busRoutesData.station.name

  const goScreensaver = useCallback(() => {
    setPhase('screensaver')
    setPickedVariant(null)
    stopRealtimeSimulator()
    resetKioskBodyTheme()
  }, [])

  const resetIdle = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(() => {
      const variantId = getActiveTaskVariant()
      if (variantId) abandonTask(variantId)
      goScreensaver()
    }, IDLE_MS)
  }, [goScreensaver])

  const wakeSession = useCallback(() => {
    resetSessionId()
    resetKioskBodyTheme()
    resetRealtimeSimulator('01')
    setPickedVariant(null)
    setPhase(skipMenu ? 'active' : 'menu')
    resetIdle()
  }, [resetIdle, skipMenu])

  const pickVariant = useCallback(
    (id: VariantId) => {
      resetKioskBodyTheme()
      setSessionVariant(id)
      setPickedVariant(id)
      setPhase('active')
      resetIdle()
    },
    [resetIdle],
  )

  const goToMenu = useCallback(() => {
    const variantId = getActiveTaskVariant()
    if (variantId) abandonTask(variantId)
    stopRealtimeSimulator()
    resetKioskBodyTheme()
    setPickedVariant(null)
    setPhase('menu')
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
    if (phase === 'screensaver') return
    resetIdle()
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [phase, resetIdle])

  useEffect(() => {
    if (phase === 'screensaver') return

    const onActivity = () => resetIdle()
    window.addEventListener('pointerdown', onActivity)
    window.addEventListener('keydown', onActivity)
    return () => {
      window.removeEventListener('pointerdown', onActivity)
      window.removeEventListener('keydown', onActivity)
    }
  }, [phase, resetIdle])

  useEffect(() => () => stopRealtimeSimulator(), [])

  const flowValue = { phase, pickedVariant, pickVariant, goToMenu }

  useKioskMisclickTracker(phase === 'active')

  return (
    <KioskFlowProvider value={flowValue}>
      <div className="kiosk-bezel-outer">
        <div
          className={`kiosk-bezel-screen kiosk-bezel-screen--${orientation}`}
        >
          {phase === 'screensaver' ? (
            <button
              type="button"
              className="kiosk-screensaver flex flex-col items-center justify-center gap-6"
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
            <div className={`kiosk-bezel-content${phase === 'active' ? ' kiosk-bezel-content--active' : ''}`}>
              {phase === 'menu' && <VariantPicker onSelect={pickVariant} />}
              {phase === 'active' && (
                <div className="kiosk-active-pane">
                  <KioskActivePane directChild={directChild} pickedVariant={pickedVariant} />
                </div>
              )}
              <button
                type="button"
                aria-label="Admin access"
                className="admin-hotspot"
                onPointerDown={onAdminHotspotTap}
              />
            </div>
          )}
        </div>
      </div>
    </KioskFlowProvider>
  )
}
