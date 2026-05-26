import { Link, useNavigate } from 'react-router-dom'
import { Bus, ChevronRight } from 'lucide-react'
import { PhoneFrame } from '../../components/PhoneFrame'
import { useKiosk, stationName } from '../../context/KioskContext'
import { getRoute } from '../../data/mockData'
import { getDestination } from '../../data/mockData'

const PHASES = [
  { path: '/app/approaching', vi: 'Xe sắp đến (500m)', en: 'Bus approaching', fig: '4.3' },
  { path: '/app/payment', vi: 'Thanh toán rảnh tay', en: 'Hands-free pay', fig: '4.4' },
  { path: '/app/get-off', vi: 'Nhắc xuống bến', en: 'Get-off alert', fig: '4.5' },
]

export function MobileAppHubPage() {
  const navigate = useNavigate()
  const { lang, selectedRouteId, destination } = useKiosk()
  const route = getRoute(selectedRouteId ?? '19')
  const dest = destination ?? getDestination('ben-thanh')
  const isVi = lang === 'vi'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-green-50 p-8">
      <p className="mb-2 text-neon-cyan">{isVi ? 'Ứng dụng di động — Sau khi quét QR' : 'Mobile app — After QR scan'}</p>
      <PhoneFrame label={isVi ? 'Context-Aware Haptic App' : 'Context-Aware Haptic App'}>
        <div className="min-h-[520px] p-5">
          <div className="mb-6 flex items-center gap-2">
            <Bus className="h-6 w-6 text-neon-green" />
            <span className="font-bold text-neon-green">BusPass</span>
          </div>
          <p className="text-xs text-gray-500">{stationName(lang)}</p>
          <h1 className="mt-2 text-xl font-bold">
            {isVi ? 'Tuyến' : 'Route'} {route?.number}
          </h1>
          <p className="text-neon-cyan">
            → {dest ? (isVi ? dest.nameVi : dest.nameEn) : '—'}
          </p>
          <p className="mt-4 rounded-lg bg-neon-green/10 p-3 text-sm text-neon-green">
            {isVi ? '✓ Lộ trình đã đồng bộ — Cất máy vào túi' : '✓ Trip synced — Pocket your phone'}
          </p>
          <p className="mt-6 text-sm text-gray-500">
            {isVi ? 'Mô phỏng các pha hành trình:' : 'Simulate journey phases:'}
          </p>
          <ul className="mt-3 space-y-2">
            {PHASES.map((p) => (
              <li key={p.path}>
                <Link
                  to={p.path}
                  className="flex items-center justify-between rounded-lg border border-kiosk-border p-3 hover:border-neon-cyan"
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
      </PhoneFrame>
      <div className="mt-8">
        <button type="button" onClick={() => navigate('/qr')} className="text-gray-500 underline">
          ← Kiosk QR
        </button>
      </div>
    </div>
  )
}
