import type { BusRoute, Destination, Lang } from '../../data/mockData'
import { trafficLabel } from '../../data/mockData'
import { RouteCountdown } from '../RouteCountdown'
import { TransparencyEta } from '../TransparencyEta'
import { tr } from '../../i18n/translations'

export function TripDetailContent({
  route,
  dest,
  lang,
}: {
  route: BusRoute
  dest: Destination | null
  lang: Lang
}) {
  const isVi = lang === 'vi'

  return (
    <div className="space-y-4 text-gray-800">
      {dest && (
        <div className="rounded-xl border border-neon-green/30 bg-white p-4">
          <p className="text-xs text-gray-500">{isVi ? 'Điểm đến' : 'Destination'}</p>
          <p className="text-lg font-bold text-neon-green">
            {dest.icon} {isVi ? dest.nameVi : dest.nameEn}
          </p>
          <p className="text-sm text-gray-500">{dest.distanceKm} km</p>
        </div>
      )}

      <div className="rounded-xl border-2 border-neon-green bg-white p-4">
        <p className="text-center text-2xl font-bold text-neon-green">
          {isVi ? 'TUYẾN' : 'ROUTE'} {route.number}
        </p>
        <div className="my-3 flex justify-center">
          <RouteCountdown routeNumber={route.number} etaRange={route.etaRange} lang={lang} large />
        </div>
        <TransparencyEta route={route} lang={lang} />
      </div>

      <section className="rounded-xl border border-kiosk-border bg-white p-4">
        <h2 className="mb-2 font-bold text-neon-green">📍 {tr('mainRoute', lang)}</h2>
        <p className="text-sm">{route.from}</p>
        {route.via.map((v) => (
          <p key={v} className="text-sm text-gray-500">
            ↓ {v}
          </p>
        ))}
        <p className="text-sm">↓ {route.to}</p>
        <p className="mt-2 text-sm text-gray-500">🚦 {trafficLabel(route.traffic, lang)}</p>
        {route.alert && <p className="mt-1 text-sm font-medium text-warning-orange">⚠️ {route.alert}</p>}
      </section>

      <section className="rounded-xl border border-kiosk-border bg-white p-4">
        <h2 className="mb-2 font-bold text-neon-green">💰 {tr('fare', lang)}</h2>
        <p className="text-sm">
          {route.fare.toLocaleString('vi-VN')}đ · {tr('studentFare', lang)}:{' '}
          {route.fareStudent.toLocaleString('vi-VN')}đ
        </p>
      </section>

      <section className="rounded-xl border border-kiosk-border bg-white p-4">
        <h2 className="mb-2 font-bold text-neon-green">
          📍 {tr('allStops', lang)} ({route.stops.length})
        </h2>
        <ul className="max-h-48 space-y-2 overflow-y-auto">
          {route.stops.map((s) => (
            <li
              key={s.id}
              className={`rounded-lg border px-3 py-2 text-sm ${
                s.isCurrent ? 'border-neon-green bg-neon-green/10' : 'border-gray-100'
              }`}
            >
              {s.isCurrent && <span className="text-neon-green">📍 </span>}
              {s.name}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-kiosk-border bg-white p-4">
        <h2 className="mb-2 font-bold text-neon-green">🚌 {tr('runningBuses', lang)}</h2>
        <ul className="space-y-2 text-sm">
          {route.vehicles.map((v) => (
            <li key={v.id}>
              {v.status === 'near' ? '🟢' : '🟡'} #{v.id}: {v.distanceKm}km · ~{v.etaMinutes}{' '}
              {tr('minutes', lang)}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
