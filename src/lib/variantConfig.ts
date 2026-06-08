export const ACTIVE_VARIANT_KEY = 'activeVariant'
export const DEFAULT_VARIANT_ID = 'Variant_6_BusPassSignature' as const

export const VARIANTS = [
  { id: 'Variant_1_CivicLight', label: 'A — Civic Light', description: 'Singapore MyTransport.SG style' },
  { id: 'Variant_2_DarkTransit', label: 'B — Dark Transit', description: 'Citymapper style' },
  { id: 'Variant_3_WarmWayfinding', label: 'C — Warm Wayfinding', description: 'Transperth — transparency in uncertainty' },
  { id: 'Variant_4_MetroMinimal', label: 'D — Moovit', description: 'Moovit — bản đồ gần đây + chỉ đường từng bước' },
  { id: 'Variant_5_HighContrast', label: 'E — High Contrast', description: 'WCAG AAA — inclusive by default' },
  { id: 'Variant_6_BusPassSignature', label: 'F — BusPass Signature', description: 'D6 — hybrid legibility map + adaptive senior mode' },
] as const

export type VariantId = (typeof VARIANTS)[number]['id']

export function getActiveVariant(): VariantId | null {
  const v = localStorage.getItem(ACTIVE_VARIANT_KEY)
  return VARIANTS.some((x) => x.id === v) ? (v as VariantId) : null
}

/** Resolved variant for kiosk render — defaults to D6 BusPass Signature. */
export function getResolvedVariant(): VariantId {
  return getActiveVariant() ?? DEFAULT_VARIANT_ID
}

export function setActiveVariant(id: VariantId) {
  localStorage.setItem(ACTIVE_VARIANT_KEY, id)
}
