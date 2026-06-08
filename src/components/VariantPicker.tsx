import { busRoutesData } from '../data/busRoutes'
import { VARIANTS, type VariantId } from '../lib/variantConfig'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'] as const

const ACCENTS: Record<VariantId, string> = {
  Variant_1_CivicLight: '#1565C0',
  Variant_2_DarkTransit: '#37B24D',
  Variant_3_WarmWayfinding: '#D97706',
  Variant_4_MetroMinimal: '#2563EB',
  Variant_5_HighContrast: '#000000',
  Variant_6_BusPassSignature: '#2563EB',
}

export function VariantPicker({ onSelect }: { onSelect: (id: VariantId) => void }) {
  const stationName = busRoutesData.station.name

  return (
    <div className="kiosk-menu-panel">
      <header className="kiosk-menu-header">
        <p className="kiosk-menu-eyebrow">Trạm {stationName}</p>
        <h1 className="kiosk-menu-title">Chọn giao diện thử nghiệm</h1>
        <p className="kiosk-menu-subtitle">Chạm một phiên bản để bắt đầu nhiệm vụ</p>
      </header>

      <ul className="kiosk-menu-grid">
        {VARIANTS.map((v, i) => (
          <li key={v.id}>
            <button
              type="button"
              className="kiosk-menu-card"
              style={{ borderTopColor: ACCENTS[v.id] }}
              onClick={() => onSelect(v.id)}
            >
              <span className="kiosk-menu-letter" style={{ backgroundColor: ACCENTS[v.id] }}>
                {LETTERS[i]}
              </span>
              <span className="kiosk-menu-card-title">{v.label}</span>
              <span className="kiosk-menu-card-desc">{v.description}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
