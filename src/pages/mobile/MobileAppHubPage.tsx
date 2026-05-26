import { Link, useNavigate } from 'react-router-dom'
import { Bus, ChevronRight, MapPin } from 'lucide-react'
import { PhoneFrame } from '../../components/PhoneFrame'
import { MobileShell } from '../../components/mobile/MobileShell'
import { useSyncTripFromUrl } from '../../hooks/useSyncTripFromUrl'
import { buildAppPath } from '../../lib/tripUrl'
import { stationName } from '../../context/KioskContext'

const PHASES = [
  { segment: 'approaching', vi: 'Xe sắp đến (500m)', en: 'Bus approaching', fig: '4.3' },
  { segment: 'payment', vi: 'Thanh toán rảnh tay', en: 'Hands-free pay', fig: '4.4' },
  { segment: 'get-off', vi: 'Nhắc xuống bến', en: 'Get-off alert', fig: '4.5' },
] as const

export function MobileAppHubPage() {
  const navigate = useNavigate()
  const { query, route, dest, lang, queryString } = useSyncTripFromUrl()
  const isVi = lang === 'vi'

  if (!route || !query) {
    return (
      <MobileShell>
        <div className="p-6 text-center text-gray-600">
          {isVi ? 'Chưa có dữ liệu chuyến. Quét QR tại kiosk.' : 'No trip data. Scan the kiosk QR.'}
        </div>
      </MobileShell>
    )
  }

  const content = (
    <div className="min-h-[520px] p-5">
      <div className="mb-6 flex items-center gap-2">
        <Bus className="h-6 w-6 text-neon-green" />
        <span className="font-bold text-neon-green">BusPass</span>
      </div>
      <p className="text-xs text-gray-500">{stationName(lang)}</p>
      <h1 className="mt-2 text-xl font-bold text-white">
        {isVi ? 'Tuyến' : 'Route'} {route.number}
      </h1>
      <p className="text-neon-cyan">
        → {dest ? (isVi ? dest.nameVi : dest.nameEn) : '—'}
      </p>
      <p className="mt-2 text-sm text-gray-400">
        ETA {route.etaRange} {isVi ? 'phút' : 'min'}
      </p>
      <p className="mt-4 rounded-lg bg-neon-green/10 p-3 text-sm text-neon-green">
        {isVi ? '✓ Lộ trình đã đồng bộ — Cất máy vào túi' : '✓ Trip synced — Pocket your phone'}
      </p>

      <Link
        to={queryString ? `/m?${queryString}` : '/m'}
        className="mt-4 flex items-center justify-between rounded-lg border border-neon-green/50 bg-neon-green/5 p-3 text-sm text-neon-green"
      >
        <span className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {isVi ? 'Xem chi tiết chuyến' : 'Trip details'}
        </span>
        <ChevronRight className="h-4 w-4" />
      </Link>

      <p className="mt-6 text-sm text-gray-500">
        {isVi ? 'Các pha hành trình:' : 'Journey phases:'}
      </p>
      <ul className="mt-3 space-y-2">
        {PHASES.map((p) => (
          <li key={p.segment}>
            <Link
              to={buildAppPath(query, p.segment)}
              className="flex items-center justify-between rounded-lg border border-kiosk-border p-3 text-white hover:border-neon-cyan"
            >
              <span className="text-sm">
                <span className="text-warning-orange">Fig {p.fig}</span> · {isVi ? p.vi : p.en}
              </span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <MobileShell badge={isVi ? 'Ứng dụng di động — Sau QR' : 'Mobile app — After QR'}>
      <PhoneFrame label={isVi ? 'Context-Aware Haptic App' : 'Context-Aware Haptic App'}>
        {content}
      </PhoneFrame>
      <div className="mt-6 flex justify-center gap-4 pb-8 text-sm">
        <button type="button" onClick={() => navigate('/qr')} className="text-gray-500 underline">
          ← Kiosk QR
        </button>
        {queryString && (
          <Link to={`/m?${queryString}`} className="text-neon-green underline">
            {isVi ? 'Chi tiết' : 'Details'}
          </Link>
        )}
      </div>
    </MobileShell>
  )
}
