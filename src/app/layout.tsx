import { Suspense, useCallback, useEffect, useState, type ReactNode } from 'react'
import { VariantPicker } from '../components/VariantPicker'
import { KioskWrapper } from '../components/KioskWrapper'
import { VariantSkeleton } from '../components/VariantSkeleton'
import { useAdminGesture } from '../hooks/useAdminGesture'
import { useKioskMisclickTracker } from '../hooks/useKioskMisclickTracker'
import { resetKioskBodyTheme } from '../lib/kioskTheme'
import {
  getSessionVariant,
  setSessionVariant as persistSessionVariant,
} from '../lib/telemetry'
import {
  ACTIVE_VARIANT_KEY,
  VARIANTS,
  type VariantId,
} from '../lib/variantConfig'
import { VARIANT_LAZY } from '../lib/variantLoaders'

function parseSessionVariant(): VariantId | null {
  const v = getSessionVariant()
  return VARIANTS.some((x) => x.id === v) ? (v as VariantId) : null
}

export function KioskLayout({ children }: { children?: ReactNode }) {
  const [sessionVariant, setSessionVariant] = useState<VariantId | null>(parseSessionVariant)
  const { onAdminHotspotTap } = useAdminGesture()
  useKioskMisclickTracker(Boolean(sessionVariant || children))

  useEffect(() => {
    document.body.classList.add('kiosk-mode')
    resetKioskBodyTheme()
    return () => {
      document.body.classList.remove('kiosk-mode')
      resetKioskBodyTheme()
    }
  }, [])

  useEffect(() => {
    const onWake = () => {
      resetKioskBodyTheme()
      setSessionVariant(null)
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === ACTIVE_VARIANT_KEY) {
        const v = parseSessionVariant()
        if (v) setSessionVariant(v)
      }
    }
    window.addEventListener('kiosk:wake', onWake)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('kiosk:wake', onWake)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const handlePickVariant = useCallback((id: VariantId) => {
    resetKioskBodyTheme()
    persistSessionVariant(id)
    setSessionVariant(id)
  }, [])

  const userId = sessionStorage.getItem('buspass_userId') ?? 'participant-01'

  const variantContent =
    children ??
    (sessionVariant ? (
      <Suspense fallback={<VariantSkeleton variantId={sessionVariant} />}>
        <div className="h-full w-full" key={sessionVariant}>
          {(() => {
            const VariantComponent = VARIANT_LAZY[sessionVariant]
            return <VariantComponent stationId="ben-thanh" userId={userId} />
          })()}
        </div>
      </Suspense>
    ) : (
      <VariantPicker onSelect={handlePickVariant} />
    ))

  return (
    <KioskWrapper>
      <div className="kiosk-shell relative h-full w-full overflow-hidden">
        {variantContent}

        <button
          type="button"
          aria-label="Admin access"
          className="admin-hotspot absolute right-0 top-0 z-[9999] h-16 w-16 opacity-0"
          onPointerDown={onAdminHotspotTap}
        />
      </div>
    </KioskWrapper>
  )
}

export default KioskLayout
