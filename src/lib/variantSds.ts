import type { VariantId } from './variantConfig'

export interface SdsDimension {
  key: string
  label: string
  score: number
}

/** Research SDS scores (1–7 scale) per variant for admin preview. */
export const VARIANT_SDS: Record<VariantId, SdsDimension[]> = {
  Variant_1_CivicLight: [
    { key: 'trust', label: 'Tin tưởng', score: 6.2 },
    { key: 'simplicity', label: 'Đơn giản', score: 6.5 },
    { key: 'clarity', label: 'Rõ ràng', score: 6.8 },
    { key: 'aesthetics', label: 'Thẩm mỹ', score: 5.4 },
    { key: 'satisfaction', label: 'Hài lòng', score: 6.1 },
  ],
  Variant_2_DarkTransit: [
    { key: 'trust', label: 'Tin tưởng', score: 4.8 },
    { key: 'simplicity', label: 'Đơn giản', score: 5.9 },
    { key: 'clarity', label: 'Rõ ràng', score: 5.2 },
    { key: 'aesthetics', label: 'Thẩm mỹ', score: 6.7 },
    { key: 'satisfaction', label: 'Hài lòng', score: 5.5 },
  ],
  Variant_3_WarmWayfinding: [
    { key: 'trust', label: 'Tin tưởng', score: 6.6 },
    { key: 'simplicity', label: 'Đơn giản', score: 5.8 },
    { key: 'clarity', label: 'Rõ ràng', score: 6.4 },
    { key: 'aesthetics', label: 'Thẩm mỹ', score: 6.0 },
    { key: 'satisfaction', label: 'Hài lòng', score: 6.3 },
  ],
  Variant_4_MetroMinimal: [
    { key: 'trust', label: 'Tin tưởng', score: 5.5 },
    { key: 'simplicity', label: 'Đơn giản', score: 6.9 },
    { key: 'clarity', label: 'Rõ ràng', score: 6.7 },
    { key: 'aesthetics', label: 'Thẩm mỹ', score: 5.8 },
    { key: 'satisfaction', label: 'Hài lòng', score: 6.0 },
  ],
  Variant_6_BusPassSignature: [
    { key: 'trust', label: 'Tin tưởng', score: 6.7 },
    { key: 'simplicity', label: 'Đơn giản', score: 6.4 },
    { key: 'clarity', label: 'Rõ ràng', score: 6.6 },
    { key: 'aesthetics', label: 'Thẩm mỹ', score: 6.5 },
    { key: 'satisfaction', label: 'Hài lòng', score: 6.8 },
  ],
}
