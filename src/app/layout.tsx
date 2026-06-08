import { Suspense, useEffect, useMemo, useState, type ReactNode } from 'react'
import { KioskWrapper } from '../components/KioskWrapper'
import { VariantSkeleton } from '../components/VariantSkeleton'
import { useAdminGesture } from '../hooks/useAdminGesture'
import { useKioskMisclickTracker } from '../hooks/useKioskMisclickTracker'
import { ACTIVE_VARIANT_KEY, getResolvedVariant, type VariantId } from '../lib/variantConfig'
import { VARIANT_LAZY } from '../lib/variantLoaders'

export function KioskLayout({ children }: { children?: ReactNode }) {
  const [variantId, setVariantId] = useState<VariantId>(getResolvedVariant)
  const { onAdminHotspotTap } = useAdminGesture()
  useKioskMisclickTracker(true)

  useEffect(() => {
    document.body.classList.add('kiosk-mode')
    return () => document.body.classList.remove('kiosk-mode')
  }, [])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === ACTIVE_VARIANT_KEY) setVariantId(getResolvedVariant())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const VariantComponent = useMemo(() => VARIANT_LAZY[variantId], [variantId])
  const userId = sessionStorage.getItem('buspass_userId') ?? 'participant-01'

  return (
    <KioskWrapper>
      <div className="kiosk-shell relative h-full w-full overflow-hidden">
        {children ?? (
          <Suspense fallback={<VariantSkeleton variantId={variantId} />}>
            <div className="h-full w-full" key={variantId}>
              <VariantComponent stationId="ben-thanh" userId={userId} />
            </div>
          </Suspense>
        )}

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
