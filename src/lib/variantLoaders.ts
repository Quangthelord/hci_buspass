import { lazy, type ComponentType } from 'react'
import type { VariantId } from './variantConfig'
import type { VariantProps } from '../variants'

export const VARIANT_LAZY: Record<VariantId, ComponentType<VariantProps>> = {
  Variant_1_CivicLight: lazy(() => import('../variants/Variant_1_CivicLight')),
  Variant_2_DarkTransit: lazy(() => import('../variants/Variant_2_DarkTransit')),
  Variant_3_WarmWayfinding: lazy(() => import('../variants/Variant_3_WarmWayfinding')),
  Variant_4_MetroMinimal: lazy(() => import('../variants/Variant_4_MetroMinimal')),
  Variant_5_HighContrast: lazy(() => import('../variants/Variant_5_HighContrast')),
  Variant_6_BusPassSignature: lazy(() => import('../variants/Variant_6_BusPassSignature')),
}
