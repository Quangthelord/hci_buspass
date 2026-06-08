import { busRoutesData } from '../../data/busRoutes'
import { BusArrivalTimer } from './BusArrivalTimer'
import { RouteTag } from './RouteTag'
import { SearchBar } from './SearchBar'
import { StopList } from './StopList'

/** Shared scaffold layout used by all 6 variant placeholders. */
export function VariantPlaceholder({
  variantId,
  title,
  skinClass = '',
}: {
  variantId: string
  title: string
  skinClass?: string
}) {
  const route = busRoutesData.routes[0]

  return (
    <div className={`flex min-h-dvh flex-col p-6 ${skinClass}`}>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-wider text-gray-500">{variantId}</p>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-gray-500">
          Nhiệm vụ: Tìm xe buýt từ Bến Thành đến Suối Tiên
        </p>
      </header>

      <SearchBar
        size="large"
        placeholder="Bạn muốn đi đâu? (vd: Suối Tiên)"
        onSearch={() => {}}
      />

      <div className="mt-6 flex items-center gap-4">
        <RouteTag routeId={route.id} color={route.color} size="lg" />
        <div>
          <p className="font-semibold">{route.name}</p>
          {route.delayReason && (
            <p className="text-sm text-warning-orange">⚠️ {route.delayReason}</p>
          )}
        </div>
      </div>

      <div className="my-6 flex justify-center">
        <BusArrivalTimer
          minutes={route.stops[0].nextArrival}
          seconds={0}
          urgencyLevel={route.currentDelay > 5 ? 'soon' : 'normal'}
        />
      </div>

      <StopList stops={route.stops} />

      <p className="mt-auto pt-6 text-center text-xs text-gray-400">
        Placeholder — thay bằng UI variant thật
      </p>
    </div>
  )
}
