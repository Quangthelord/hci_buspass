import { busRoutesData } from '../data/busRoutes'
import { VARIANTS, type VariantId } from '../lib/variantConfig'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'] as const

const ACCENTS: Record<VariantId, string> = {
  Variant_1_CivicLight: '#16a34a',
  Variant_2_DarkTransit: '#00B4D8',
  Variant_3_WarmWayfinding: '#D97706',
  Variant_4_MetroMinimal: '#2563EB',
  Variant_5_HighContrast: '#000000',
  Variant_6_BusPassSignature: '#2563EB',
}

export function VariantPicker({ onSelect }: { onSelect: (id: VariantId) => void }) {
  const stationName = busRoutesData.station.name

  return (
    <div className="variant-picker flex h-full min-h-0 w-full flex-col overflow-y-auto">
      <header className="variant-picker-header shrink-0 px-6 pb-4 pt-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
          Trạm {stationName}
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          Chọn giao diện thử nghiệm
        </h1>
        <p className="mt-2 text-base text-slate-600">
          Chạm một phiên bản để bắt đầu nhiệm vụ
        </p>
      </header>

      <ul className="variant-picker-grid mx-auto grid w-full max-w-3xl flex-1 gap-4 px-5 pb-8 sm:grid-cols-2">
        {VARIANTS.map((v, i) => (
          <li key={v.id}>
            <button
              type="button"
              className="variant-picker-card flex h-full min-h-[120px] w-full flex-col items-start rounded-2xl border-2 border-slate-200 bg-white p-5 text-left shadow-sm transition active:scale-[0.98]"
              style={{ borderTopWidth: 6, borderTopColor: ACCENTS[v.id] }}
              onClick={() => onSelect(v.id)}
            >
              <span
                className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold text-white"
                style={{ backgroundColor: ACCENTS[v.id] }}
              >
                {LETTERS[i]}
              </span>
              <span className="text-lg font-bold text-slate-900">{v.label}</span>
              <span className="mt-1 text-sm leading-snug text-slate-600">{v.description}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
