import {
  ArrowLeft,
  ArrowLeftRight,
  Bus,
  Camera,
  ChevronDown,
  Clock,
  Footprints,
  Share2,
} from 'lucide-react'
import type { BusRouteData } from '../../data/busRoutes'
import { ORIGIN_ADDRESS } from './constants'
import {
  MvBottomNav,
  MvFavPrompt,
  MvFilterButton,
  MvLocateButton,
  MvRouteTimeline,
} from './MvComponents'
import { MvMap } from './MvMap'
import type { RouteOption } from './routeOptions'
import {
  buildRouteTimeline,
  formatArrivalLabel,
  formatClock,
  formatTimeRange,
  getDestination,
  getWalkMinutes,
} from './utils'

/* ── Nearby / Map ── */
export function MvNearbyScreen({
  stationName,
  nearbyRoutes,
  tab,
  onTabChange,
  onRouteTap,
  onDirections,
  onMap,
  onRoutes,
}: {
  stationName: string
  nearbyRoutes: BusRouteData[]
  tab: 'nearby' | 'favorites'
  onTabChange: (t: 'nearby' | 'favorites') => void
  onRouteTap: (route: BusRouteData) => void
  onDirections: () => void
  onMap: () => void
  onRoutes: () => void
}) {
  const lineIds = nearbyRoutes.map((r) => r.id).join(', ')

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <div className="mv-map-wrap mv-map-wrap--nearby">
        <MvMap variant="nearby" />
        <MvLocateButton />
      </div>

      <MvFavPrompt />

      <div className="mv-nearby-panel">
        <div className="mv-tabs">
          <button
            type="button"
            className={`mv-tab ${tab === 'nearby' ? 'mv-tab--active' : ''}`}
            onClick={() => onTabChange('nearby')}
          >
            Những nhà ga xung quanh
          </button>
          <button
            type="button"
            className={`mv-tab ${tab === 'favorites' ? 'mv-tab--active' : ''}`}
            onClick={() => onTabChange('favorites')}
          >
            Yêu thích
          </button>
        </div>

        {tab === 'nearby' ? (
          <>
            <div className="mv-station-header">
              <span className="mv-bus-icon-sq">
                <Bus className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <div className="min-w-0">
                <p className="font-extrabold text-[#1A1A1A]">{stationName}</p>
                <p className="text-sm text-[#888]">
                  Đi bộ 1 phút • {lineIds}
                </p>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {nearbyRoutes.map((route) => {
                const wait = route.stops[0].nextArrival + route.currentDelay
                const dest = route.stops[route.stops.length - 1].name
                const isPrimary = route.id === '01'
                return (
                  <button
                    key={route.id}
                    type="button"
                    className="mv-route-row"
                    onClick={() => onRouteTap(route)}
                  >
                    <Bus className="h-5 w-5 shrink-0 text-[#4CAF50]" strokeWidth={2} />
                    <span
                      className={`mv-line-badge ${isPrimary ? 'mv-line-badge--filled' : 'mv-line-badge--green'}`}
                    >
                      {route.id}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-[#333]">
                      {dest}
                    </span>
                    <span className="shrink-0 text-sm font-bold tabular-nums text-[#1A1A1A]">
                      {formatArrivalLabel(wait)}
                    </span>
                  </button>
                )
              })}
            </div>
          </>
        ) : (
          <p className="p-6 text-center text-sm text-[#999]">
            Chưa có mục yêu thích. Chạm ★ trên tuyến để lưu.
          </p>
        )}
      </div>

      <MvBottomNav active="map" onDirections={onDirections} onMap={onMap} onRoutes={onRoutes} />
    </div>
  )
}

/* ── Planner / Directions ── */
export function MvPlannerScreen({
  origin,
  destination,
  routeOptions,
  onBack,
  onSwap,
  onOriginChange,
  onDestinationChange,
  onSelectRoute,
  onSearchFocus,
}: {
  origin: string
  destination: string
  routeOptions: RouteOption[]
  onBack: () => void
  onSwap: () => void
  onOriginChange: (v: string) => void
  onDestinationChange: (v: string) => void
  onSelectRoute: (opt: RouteOption) => void
  onSearchFocus: () => void
}) {
  const hasDest = destination.trim().length > 0

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="mv-planner-header shrink-0">
        <button type="button" onClick={onBack} className="mb-2 p-1 text-white/80">
          <ArrowLeft className="h-6 w-6" />
        </button>

        <div className="mv-field-stack">
          <div className="mv-fields">
            <div className="mv-field">
              <span className="mv-field-dot" />
              <input
                value={origin}
                onChange={(e) => onOriginChange(e.target.value)}
                className="mv-field-input"
                placeholder="Điểm xuất phát"
              />
            </div>
            <div className="mv-field" onPointerDown={onSearchFocus}>
              <span className="mv-field-dot mv-field-dot--pin" />
              <input
                value={destination}
                onChange={(e) => onDestinationChange(e.target.value)}
                className="mv-field-input"
                placeholder="Điểm đến"
                autoFocus={!hasDest}
              />
            </div>
          </div>
          <button type="button" onClick={onSwap} className="mv-swap-btn" aria-label="Đổi chiều">
            <ArrowLeftRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mv-action-bar">
          <button type="button" className="mv-depart-btn">
            <Clock className="h-4 w-4" />
            Rời đi ngay
            <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          </button>
          <MvFilterButton />
        </div>
      </div>

      <div className="mv-results">
        {hasDest ? (
          <>
            <p className="mv-section-label">Tuyến gợi ý</p>
            {routeOptions.map((opt) => {
              const tl = buildRouteTimeline(opt, destination)
              return (
                <button
                  key={opt.id}
                  type="button"
                  className="mv-route-card"
                  onClick={() => onSelectRoute(opt)}
                >
                  <p className="mv-route-duration">{tl.totalMin} phút</p>
                  <MvRouteTimeline
                    walkBefore={tl.walkBefore}
                    routeId={tl.routeId}
                    walkAfter={tl.walkAfter}
                  />
                  <p className="mv-depart-sub">
                    Khởi hành lúc {formatClock(tl.departMin)} từ {origin}
                  </p>
                </button>
              )
            })}
          </>
        ) : (
          <p className="p-6 text-center text-sm text-[#888]">
            Nhập điểm đến để xem tuyến gợi ý
          </p>
        )}
      </div>
    </div>
  )
}

/* ── Route detail / Chỉ đường ── */
export function MvRouteDetailScreen({
  option,
  destination,
  stationName,
  onBack,
  onStopClick,
}: {
  option: RouteOption
  destination: string
  stationName: string
  onBack: () => void
  onStopClick: (id: string) => void
}) {
  const route = option.route
  const dest = getDestination(route, destination)
  const walk = getWalkMinutes()
  const departMin = option.nextDeparture
  const totalMin = option.travelTimeMin + walk + 2
  const destStop =
    route.stops.find((s) => s.name.toLowerCase().includes(destination.toLowerCase())) ??
    route.stops[route.stops.length - 1]
  const visibleStops = route.stops.slice(0, route.stops.indexOf(destStop) + 1)

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <div className="mv-detail-header shrink-0">
        <button type="button" onClick={onBack} className="p-1">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="mv-detail-title">Chỉ đường</h1>
        <button type="button" className="p-1 text-[#666]">
          <Share2 className="h-5 w-5" />
        </button>
      </div>

      <div className="mv-map-wrap mv-map-wrap--detail shrink-0">
        <MvMap variant="detail" routeColor={route.id === '01' ? '#43A047' : '#1E88E5'} />
        <MvLocateButton />
        <div className="mv-modes-badge">
          <span className="mv-modes-badge-head">
            <Bus className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="mv-modes-badge-text">Mọi phương tiện vận tải</span>
        </div>
      </div>

      <div className="mv-time-bar shrink-0">
        <button type="button" className="mv-time-bar-btn">
          ‹ Trước đó
        </button>
        <span className="mv-time-bar-center">{formatTimeRange(departMin, totalMin)}</span>
        <button type="button" className="mv-time-bar-btn">
          Sau đó ›
        </button>
      </div>

      <div className="mv-steps-panel">
        <div className="mv-step">
          <div className="mv-step-icon">
            <span className="mv-step-pin" />
          </div>
          <div className="mv-step-body">
            <p className="mv-step-label">
              Bắt đầu từ <span className="mv-step-place">{ORIGIN_ADDRESS}</span>
            </p>
            <p className="mv-step-meta">Rời đi lúc {formatClock(departMin)}</p>
          </div>
        </div>

        <div className="mv-step">
          <div className="mv-step-icon">
            <span className="mv-step-transit">
              <Footprints className="h-4 w-4" strokeWidth={2.5} />
            </span>
          </div>
          <div className="mv-step-body">
            <p className="mv-step-label">
              Đi bộ đến <span className="mv-step-place">{stationName}</span>
            </p>
            <p className="mv-step-meta">260 m • {walk} phút</p>
          </div>
          <div className="mv-step-actions">
            <button type="button" className="mv-camera-btn" aria-label="Wayfinder">
              <Camera className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="mv-step">
          <div className="mv-step-icon">
            <span className="mv-step-transit">
              <Bus className="h-4 w-4" strokeWidth={2.5} />
            </span>
          </div>
          <div className="mv-step-body">
            <p className="mv-step-label">
              Tuyến <span className="mv-step-place">{route.id}</span> — {route.name}
            </p>
            <p className="mv-step-meta">
              {option.stopCount} trạm • {option.travelTimeMin} phút • Xuống tại {dest}
            </p>
            <ul className="mv-stop-list">
              {visibleStops.map((stop, i) => (
                <li key={stop.id}>
                  <button
                    type="button"
                    onClick={() => onStopClick(stop.id)}
                    className="mv-stop-item w-full text-left"
                  >
                    <span
                      className={`mv-stop-dot ${i === visibleStops.length - 1 ? 'mv-stop-dot--end' : ''}`}
                    />
                    <span className={i === visibleStops.length - 1 ? 'font-bold text-[#43A047]' : ''}>
                      {stop.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mv-step">
          <div className="mv-step-icon">
            <span className="mv-step-pin" style={{ background: '#43A047' }} />
          </div>
          <div className="mv-step-body">
            <p className="mv-step-label">
              Đến <span className="mv-step-place text-[#43A047]">{dest}</span>
            </p>
            <p className="mv-step-meta">Dự kiến lúc {formatClock(departMin + totalMin)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
