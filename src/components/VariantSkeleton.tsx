import type { VariantId } from '../lib/variantConfig'

const SCHEMES: Record<
  VariantId,
  { bg: string; accent: string; card: string; label: string }
> = {
  Variant_1_CivicLight: { bg: '#f5f5f5', accent: '#009b3a', card: '#ffffff', label: 'Civic Light' },
  Variant_2_DarkTransit: { bg: '#F0F2F5', accent: '#37b24d', card: '#ffffff', label: 'Citymapper' },
  Variant_3_WarmWayfinding: { bg: '#F5F5F5', accent: '#00703C', card: '#FFFFFF', label: 'TransPerth' },
  Variant_4_MetroMinimal: { bg: '#F0F0F0', accent: '#F26722', card: '#FFFFFF', label: 'Moovit' },
  Variant_6_BusPassSignature: { bg: '#F7F5F0', accent: '#2563EB', card: '#FFFFFF', label: 'BusPass System' },
}

export function VariantSkeleton({ variantId }: { variantId: VariantId }) {
  const s = SCHEMES[variantId]
  return (
    <div
      className="flex h-full min-h-[480px] w-full flex-col gap-4 p-5"
      style={{ backgroundColor: s.bg }}
      aria-busy
      aria-label={`Đang tải ${s.label}`}
    >
      <div className="flex justify-between gap-4">
        <div className="h-8 w-40 animate-pulse rounded-lg" style={{ backgroundColor: s.card }} />
        <div className="h-8 w-20 animate-pulse rounded-lg" style={{ backgroundColor: s.card }} />
      </div>
      <div className="h-12 w-full animate-pulse rounded-xl" style={{ backgroundColor: s.card }} />
      <div className="flex min-h-0 flex-1 gap-4">
        <div
          className="min-h-[200px] flex-1 animate-pulse rounded-xl"
          style={{ backgroundColor: s.card, border: `2px solid ${s.accent}22` }}
        />
        <div className="flex w-36 shrink-0 flex-col gap-3">
          <div className="h-24 animate-pulse rounded-xl" style={{ backgroundColor: s.card }} />
          <div className="h-24 animate-pulse rounded-xl" style={{ backgroundColor: s.card }} />
        </div>
      </div>
      <p className="text-center text-sm font-medium" style={{ color: s.accent }}>
        Đang tải giao diện…
      </p>
    </div>
  )
}
