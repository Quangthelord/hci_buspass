import type { BusRouteData } from '../../data/busRoutes'
import { formatDelayStatus, formatRouteLabel } from '../../lib/formatVi'
import { RouteLinePill } from './RouteLinePill'
import { DARK } from './constants'

export function BottomSheet({
  route,
  expanded,
  onToggle,
  onRouteSelect,
  onSearchFocus,
  destination,
}: {
  route: BusRouteData
  expanded: boolean
  onToggle: () => void
  onRouteSelect: (id: string) => void
  onSearchFocus: () => void
  destination: string
}) {
  const minutes = route.stops[0].nextArrival + route.currentDelay

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-20 rounded-t-2xl shadow-2xl transition-all duration-300 ease-out"
      style={{
        backgroundColor: DARK.card,
        maxHeight: expanded ? '72vh' : 'auto',
      }}
    >
      {/* Drag handle */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full flex-col items-center pt-3 pb-2"
        aria-expanded={expanded}
      >
        <span className="mb-2 h-1 w-10 rounded-full bg-slate-600" />
        {!expanded && (
          <div className="flex w-full items-center justify-between px-5 pb-3">
            <div className="flex items-center gap-3">
              <span
                className="rounded-lg px-2.5 py-1 text-sm font-normal text-white"
                style={{ backgroundColor: DARK.purple }}
              >
                {route.id}
              </span>
              <span className="text-sm" style={{ color: DARK.text }}>
                {formatRouteLabel(route.id)} → {destination}
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-normal tabular-nums" style={{ color: DARK.cyan }}>
                {minutes}
              </span>
              <span className="ml-1 text-sm" style={{ color: DARK.muted }}>
                phút
              </span>
            </div>
          </div>
        )}
      </button>

      {expanded && (
        <div className="overflow-y-auto px-5 pb-6" style={{ maxHeight: 'calc(72vh - 2rem)' }}>
          <h2 className="mb-1 text-base font-normal" style={{ color: DARK.text }}>
            Lộ trình đề xuất
          </h2>
          <p className="mb-4 text-sm" style={{ color: DARK.muted }}>
            {route.name}
          </p>

          <div className="mb-4 flex items-baseline gap-2">
            <span className="text-4xl font-normal tabular-nums" style={{ color: DARK.cyan }}>
              {minutes}
            </span>
            <span className="text-sm" style={{ color: DARK.muted }}>
              phút
            </span>
            {route.currentDelay > 0 && (
              <span className="text-sm" style={{ color: DARK.purple }}>
                {formatDelayStatus(route.currentDelay)}
              </span>
            )}
          </div>

          <RouteLinePill stops={route.stops} />

          <label className="mt-4 block">
            <span className="mb-1 block text-sm" style={{ color: DARK.muted }}>
              Điểm đến
            </span>
            <input
              type="search"
              placeholder="Suối Tiên, Chợ Lớn..."
              onFocus={onSearchFocus}
              className="w-full rounded-lg border border-slate-600 bg-[#1A1A2E] px-3 py-2 text-sm font-normal outline-none focus:border-[#00B4D8]"
              style={{ color: DARK.text }}
            />
          </label>

          <ul className="mt-4 space-y-2">
            {route.stops.map((stop, i) => (
              <li key={stop.id}>
                <button
                  type="button"
                  onClick={() => onRouteSelect(`stop-${stop.id}`)}
                  className="flex w-full items-center gap-3 rounded-lg border border-slate-700 px-3 py-2 text-left text-sm"
                  style={{ color: DARK.text }}
                >
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs"
                    style={{ backgroundColor: DARK.bg, color: DARK.cyan }}
                  >
                    {i + 1}
                  </span>
                  <span className="font-normal">{stop.name}</span>
                  <span className="ml-auto text-xs" style={{ color: DARK.muted }}>
                    {stop.nextArrival} phút
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
