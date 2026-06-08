import type { ComponentType } from 'react'
import type { VariantId } from '../lib/variantConfig'
import type { Variant1Props } from './Variant_1_CivicLight'

export type VariantProps = Partial<Variant1Props>
import Variant1 from './Variant_1_CivicLight'
import Variant2 from './Variant_2_DarkTransit'
import Variant3 from './Variant_3_WarmWayfinding'
import Variant4 from './Variant_4_MetroMinimal'
import Variant5 from './Variant_5_HighContrast'
import Variant6 from './Variant_6_BusPassSignature'

export const VARIANT_COMPONENTS: Record<VariantId, ComponentType<VariantProps>> = {
  Variant_1_CivicLight: Variant1,
  Variant_2_DarkTransit: Variant2,
  Variant_3_WarmWayfinding: Variant3,
  Variant_4_MetroMinimal: Variant4,
  Variant_5_HighContrast: Variant5,
  Variant_6_BusPassSignature: Variant6,
}

export function getVariantComponent(id: VariantId): ComponentType<VariantProps> {
  return VARIANT_COMPONENTS[id]
}
