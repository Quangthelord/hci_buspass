import { createContext, useContext } from 'react'
import type { VariantId } from '../lib/variantConfig'

export type KioskPhase = 'screensaver' | 'menu' | 'active'

export interface KioskFlowValue {
  phase: KioskPhase
  pickedVariant: VariantId | null
  pickVariant: (id: VariantId) => void
  /** Quay về màn chọn giao diện A–E */
  goToMenu: () => void
}

const KioskFlowContext = createContext<KioskFlowValue | null>(null)

export function useKioskFlow(): KioskFlowValue {
  const ctx = useContext(KioskFlowContext)
  if (!ctx) throw new Error('useKioskFlow must be used within KioskWrapper')
  return ctx
}

export function useKioskFlowOptional(): KioskFlowValue | null {
  return useContext(KioskFlowContext)
}

export const KioskFlowProvider = KioskFlowContext.Provider
