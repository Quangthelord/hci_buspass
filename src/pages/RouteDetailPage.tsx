import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Smartphone } from 'lucide-react'
import { KioskLayout } from '../components/KioskLayout'
import { KioskNavBar } from '../components/KioskNavBar'
import { useKiosk } from '../context/KioskContext'
import { getRoute } from '../data/mockData'
import { tr } from '../i18n/translations'

export function RouteDetailPage() {
  const { routeId } = useParams<{ routeId: string }>()
  const navigate = useNavigate()
  const { lang, setSelectedRouteId } = useKiosk()
  const [stopQuery, setStopQuery] = useState('')

  const route = getRoute(routeId ?? '')
  const stops = useMemo(() => {
    if (!route) return []
    const q = stopQuery.toLowerCase()
    if (!q) return route.stops
    return route.stops.filter((s) => s.name.toLowerCase().includes(q))
  }, [route, stopQuery])

  if (!route) {
    return (
      <KioskLayout scrollable={false}>
        <div className="kiosk-page-pad flex flex-1 flex-col p-6">
          <KioskNavBar backTo="/map" />
          <p className="mt-8 text-center text-gray-500">{lang === 'vi' ? 'Không tìm thấy tuyến' : 'Route not found'}</p>
        </div>
      </KioskLayout>
    )
  }

  const sync = () => {
    setSelectedRouteId(route.id)
    navigate('/qr')
  }

  return (
    <KioskLayout scrollable={false}>
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="flex min-w-0 flex-col overflow-y-auto border-b border-kiosk-border p-6 lg:w-[42%] lg:border-b-0 lg:border-r">
          <KioskNavBar backTo="history" className="mb-4" />

          <h1 className="text-4xl font-bold text-neon-green">🚌 TUYẾN {route.number}</h1>
          <hr className="my-4 border-kiosk-border" />

          <section className="mb-6">
            <h2 className="font-bold text-neon-cyan">📍 {tr('mainRoute', lang)}</h2>
            <div className="mt-2 space-y-1 text-lg">
              <p>{route.from}</p>
              {route.via.map((v) => (
                <p key={v} className="text-gray-500">
                  ↓ {v}
                </p>
              ))}
              <p>↓ {route.to}</p>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="font-bold text-neon-cyan">⏱️ {tr('schedule', lang)}</h2>
            <ul className="mt-2 space-y-1 text-gray-600">
              <li>
                • {tr('firstTrip', lang)}: {route.firstTrip}
              </li>
              <li>
                • {tr('lastTrip', lang)}: {route.lastTrip}
              </li>
              <li>
                • {tr('interval', lang)}: {route.interval}
              </li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="font-bold text-neon-cyan">💰 {tr('fare', lang)}</h2>
            <ul className="mt-2 space-y-1 text-gray-600">
              <li>
                • {tr('regularFare', lang)}: {route.fare.toLocaleString('vi-VN')}đ
              </li>
              <li>
                • {tr('studentFare', lang)}: {route.fareStudent.toLocaleString('vi-VN')}đ
              </li>
              <li>• {tr('seniorFree', lang)}</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="font-bold text-neon-cyan">🚌 {tr('runningBuses', lang)}</h2>
            <ul className="mt-3 space-y-3">
              {route.vehicles.map((v) => (
                <li key={v.id} className="flex gap-3 text-lg">
                  <span>{v.status === 'near' ? '🟢' : '🟡'}</span>
                  <span>
                    Xe #{v.id}: {lang === 'vi' ? 'Cách trạm' : 'Distance'}{' '}
                    {v.distanceKm}km ({v.etaMinutes}-{v.etaMinutes + 2} {tr('minutes', lang)})
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <button
            type="button"
            onClick={sync}
            className="btn-kiosk flex w-full items-center justify-center gap-2 rounded-xl bg-neon-green py-5 text-xl font-bold text-white"
          >
            <Smartphone className="h-6 w-6" />
            {tr('selectAndSync', lang)} 📱
          </button>
        </div>

        <aside className="flex min-h-0 flex-1 flex-col p-6 lg:min-w-0">
          <h2 className="mb-4 text-xl font-bold">
            📍 {tr('allStops', lang)} ({route.stops.length})
          </h2>
          <input
            type="search"
            value={stopQuery}
            onChange={(e) => setStopQuery(e.target.value)}
            placeholder={tr('searchStops', lang)}
            className="mb-4 rounded-lg border border-kiosk-border bg-kiosk-bg px-4 py-2 outline-none focus:border-neon-green"
          />
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
            {stops.map((s) => (
              <div
                key={s.id}
                className={`rounded-lg border px-4 py-3 ${
                  s.isCurrent
                    ? 'border-neon-green bg-neon-green/10'
                    : s.isTerminal
                      ? 'border-warning-orange/50'
                      : 'border-kiosk-border'
                }`}
              >
                <span className="text-gray-500">─ {String(s.id).padStart(2, '0')} ─</span>
                <p className="font-semibold">
                  {s.isTerminal && '⭐ '}
                  {s.isCurrent && '📍 '}
                  {s.name}
                </p>
                {s.isCurrent && (
                  <p className="text-xs text-neon-green">← {tr('youAreHere', lang)}</p>
                )}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </KioskLayout>
  )
}
