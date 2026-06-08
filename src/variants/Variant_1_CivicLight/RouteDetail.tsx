import type { BusRouteData } from '../../data/busRoutes'
import { RouteTag } from '../../components/shared/RouteTag'
import { HCMC_ROUTE_COLORS } from './constants'

export function RouteDetail({
  route,
  onBack,
  onStopClick,
}: {
  route: BusRouteData
  onBack: () => void
  onStopClick: (target: string) => void
}) {
  const color = HCMC_ROUTE_COLORS[route.id] ?? route.color
  const stationStop = route.stops[0]
  const minutes = stationStop.nextArrival + route.currentDelay
  const onTime = route.currentDelay === 0

  return (
    <div className="flex min-h-dvh flex-col bg-white text-[#111827]">
      <header className="border-b border-[#E5E7EB] px-5 py-4">
        <button
          type="button"
          onClick={() => {
            onStopClick('detail-back')
            onBack()
          }}
          className="mb-3 text-lg font-semibold text-[#16A34A]"
        >
          ← Quay lại
        </button>
        <div className="flex items-center gap-4">
          <RouteTag routeId={route.id} color={color} size="lg" />
          <div>
            <h1 className="text-2xl font-bold">{route.name}</h1>
            <p className={`text-lg font-semibold ${onTime ? 'text-[#16A34A]' : 'text-[#EA580C]'}`}>
              {onTime ? 'Đúng giờ' : `Trễ ~${route.currentDelay} phút`}
              {route.delayReason ? ` · ${route.delayReason}` : ''}
            </p>
          </div>
        </div>
        <p className="mt-3 text-2xl font-bold tabular-nums">
          <span className={onTime ? 'text-[#16A34A]' : 'text-[#EA580C]'}>{minutes}</span>
          <span className="ml-1 text-lg font-semibold">phút</span>
        </p>
      </header>

      <section className="flex-1 overflow-y-auto px-5 py-4">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">
          Danh sách trạm dừng
        </h2>
        <ul className="space-y-2">
          {route.stops.map((stop, i) => (
            <li key={stop.id}>
              <button
                type="button"
                onClick={() => onStopClick(`stop-${stop.id}`)}
                className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-left"
              >
                <p className="text-lg font-bold">
                  {String(i + 1).padStart(2, '0')}. {stop.name}
                </p>
                <p className="text-base text-gray-500">
                  ~{stop.nextArrival} phút · tiếp theo ~{stop.nextNextArrival} phút
                </p>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
