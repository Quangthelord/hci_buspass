import { useEffect } from 'react'
import { getSessionVariant, logClick } from '../lib/telemetry'
import { getResolvedVariant } from '../lib/variantConfig'

const INTERACTIVE =
  'button, a, input, select, textarea, [role="button"], [role="link"], [role="tab"], label, .admin-hotspot'

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false
  if (target.closest('.admin-hotspot')) return true
  return Boolean(target.closest(INTERACTIVE))
}

/** Logs misclicks when the user taps non-interactive areas inside the kiosk shell. */
export function useKioskMisclickTracker(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return

    const onPointerDown = (e: PointerEvent) => {
      if (isInteractiveTarget(e.target)) return
      const shell = document.querySelector('.kiosk-active-pane')
      if (!shell?.contains(e.target as Node)) return

      const variantId = getSessionVariant() ?? getResolvedVariant()
      logClick(variantId, 'dead-zone', false)
      window.dispatchEvent(
        new CustomEvent('kiosk:misclick', { detail: { target: 'dead-zone', variantId } }),
      )
    }

    document.addEventListener('pointerdown', onPointerDown, true)
    return () => document.removeEventListener('pointerdown', onPointerDown, true)
  }, [enabled])
}

export { isInteractiveTarget }
