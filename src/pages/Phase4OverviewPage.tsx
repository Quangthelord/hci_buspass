import { Link } from 'react-router-dom'
import { KioskLayout } from '../components/KioskLayout'
import { useKiosk } from '../context/KioskContext'

const FEATURES = [
  {
    fig: '4.1',
    titleVi: 'Bản đồ định tuyến thời gian thực (Kiosk)',
    titleEn: 'Real-time routing map (Kiosk)',
    path: '/map',
    descVi: 'Bản đồ OSM, xe GPS, đường neon, ETA 2–5 phút',
    descEn: 'OSM map, GPS buses, neon route, ETA range',
  },
  {
    fig: '4.2',
    titleVi: 'Đồng bộ lộ trình một chạm (Kiosk → App)',
    titleEn: 'One-tap sync (Kiosk → App)',
    path: '/qr',
    descVi: 'QR động, handoff sang điện thoại',
    descEn: 'Dynamic QR, handoff to phone',
  },
  {
    fig: '4.3',
    titleVi: 'Vòng nhận thức ngoại vi — Haptic',
    titleEn: 'Peripheral awareness — Haptic',
    path: '/app/approaching',
    descVi: 'Rung nhịp khi xe ~500m',
    descEn: 'Pulse vibration ~500m',
  },
  {
    fig: '4.4',
    titleVi: 'Thanh toán rảnh tay',
    titleEn: 'Hands-free payment',
    path: '/app/payment',
    descVi: 'Pop-up màn hình khóa 7.000đ',
    descEn: 'Lock screen 7,000 VND popup',
  },
  {
    fig: '4.5',
    titleVi: 'Rung nhắc xuống bến',
    titleEn: 'Smart get-off alert',
    path: '/app/get-off',
    descVi: 'Danh sách trạm dọc + rung mạnh',
    descEn: 'Vertical stops + strong vibration',
  },
]

export function Phase4OverviewPage() {
  const { lang } = useKiosk()
  const isVi = lang === 'vi'

  return (
    <KioskLayout scrollable>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-8 py-6">
        <h1 className="text-3xl font-bold text-neon-green neon-text">
          PHASE 4: HIGH-FIDELITY PROTOTYPES
        </h1>
        <p className="mt-2 text-gray-500">
          {isVi
            ? 'Visual-Centric Kiosk + Context-Aware Haptic App'
            : 'Visual-Centric Kiosk + Context-Aware Haptic App'}
        </p>

        <section className="mt-8 rounded-xl border border-kiosk-border bg-kiosk-panel p-6">
          <h2 className="text-xl font-bold text-neon-cyan">4.1.2 {isVi ? 'Luồng người dùng' : 'User flow'}</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-gray-600">
            <li>
              <Link to="/map" className="text-neon-green underline">
                {isVi ? 'Tra cứu Kiosk' : 'Kiosk lookup'}
              </Link>
            </li>
            <li>
              <Link to="/qr" className="text-neon-green underline">
                {isVi ? 'Quét QR đồng bộ' : 'QR handover'}
              </Link>
            </li>
            <li>
              <Link to="/app" className="text-neon-green underline">
                {isVi ? 'Chờ đợi (App)' : 'Wait (App)'}
              </Link>
            </li>
            <li>
              <Link to="/app/payment" className="text-neon-green underline">
                {isVi ? 'Thanh toán lên xe' : 'Board & pay'}
              </Link>
            </li>
            <li>
              <Link to="/app/get-off" className="text-neon-green underline">
                {isVi ? 'Xuống bến' : 'Get off'}
              </Link>
            </li>
          </ol>
        </section>

        <h2 className="mt-10 text-xl font-bold">4.3 {isVi ? 'Tính năng prototype' : 'Prototype features'}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Link
              key={f.fig}
              to={f.path}
              className="rounded-xl border border-kiosk-border bg-kiosk-panel p-5 transition hover:border-neon-green"
            >
              <span className="text-warning-orange font-bold">Hình {f.fig}</span>
              <h3 className="mt-2 font-bold">{isVi ? f.titleVi : f.titleEn}</h3>
              <p className="mt-1 text-sm text-gray-500">{isVi ? f.descVi : f.descEn}</p>
              <p className="mt-3 text-sm text-neon-cyan">→ {f.path}</p>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-sm text-gray-500">
          {isVi ? 'Báo cáo chi tiết:' : 'Full report text:'}{' '}
          <code className="text-neon-cyan">docs/PHASE4_HIFI.md</code>
        </p>
      </div>
    </KioskLayout>
  )
}
