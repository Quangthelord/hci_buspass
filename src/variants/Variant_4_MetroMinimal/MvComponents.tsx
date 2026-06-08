import { Bus, ChevronUp, Crosshair, Filter, Footprints, MapPin, Route } from 'lucide-react'
import { getRouteLineColor } from './utils'

export function MvLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <svg width="22" height="26" viewBox="0 0 22 26" aria-hidden>
        <path
          d="M11 0 C5 0 1 5 1 11 C1 18 11 26 11 26 C11 26 21 18 21 11 C21 5 17 0 11 0Z"
          fill="#F26722"
        />
        <circle cx="8" cy="10" r="1.5" fill="#1A1A1A" />
        <circle cx="14" cy="10" r="1.5" fill="#1A1A1A" />
        <path d="M8 14 Q11 17 14 14" stroke="#1A1A1A" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </svg>
      <span className="text-sm font-bold text-[#1A1A1A]">moovit</span>
    </div>
  )
}

export function MvBottomNav({
  active,
  onDirections,
  onMap,
  onRoutes,
}: {
  active: 'directions' | 'map' | 'routes'
  onDirections: () => void
  onMap: () => void
  onRoutes: () => void
}) {
  return (
    <nav className="mv-bottom-nav shrink-0">
      <button
        type="button"
        className={`mv-nav-item ${active === 'directions' ? 'mv-nav-item--active' : ''}`}
        onClick={onDirections}
      >
        <Route className="mv-nav-icon h-5 w-5" strokeWidth={2} />
        Chỉ đường
      </button>
      <button
        type="button"
        className={`mv-nav-item ${active === 'map' ? 'mv-nav-item--active' : ''}`}
        onClick={onMap}
      >
        <MapPin className="mv-nav-icon h-5 w-5" strokeWidth={2} />
        Bản đồ
      </button>
      <button
        type="button"
        className={`mv-nav-item ${active === 'routes' ? 'mv-nav-item--active' : ''}`}
        onClick={onRoutes}
      >
        <Bus className="mv-nav-icon h-5 w-5" strokeWidth={2} />
        Tuyến xe
      </button>
    </nav>
  )
}

export function MvLocateButton() {
  return (
    <button type="button" className="mv-locate-btn" aria-label="Vị trí của tôi">
      <Crosshair className="h-5 w-5" strokeWidth={2} />
    </button>
  )
}

export function MvFavPrompt() {
  return (
    <div className="mv-fav-prompt">
      <span className="mv-fav-icon">
        <ChevronUp className="h-4 w-4" strokeWidth={2.5} />
      </span>
      <span className="text-sm font-semibold text-[#333]">Lưu mục ưa thích của bạn</span>
    </div>
  )
}

export function MvTransitChip({ routeId }: { routeId: string }) {
  const color = getRouteLineColor(routeId)
  return (
    <span className="mv-transit-chip">
      <span className="mv-transit-chip-top">
        <Bus className="h-3 w-3" strokeWidth={2.5} />
        {routeId}
      </span>
      <span className={`mv-transit-chip-bar mv-transit-chip-bar--${color}`} />
    </span>
  )
}

export function MvWalkChip({ minutes }: { minutes: number }) {
  return (
    <span className="mv-walk-chip">
      <Footprints className="h-3.5 w-3.5" strokeWidth={2.5} />
      {minutes}
    </span>
  )
}

export function MvRouteTimeline({
  walkBefore,
  routeId,
  walkAfter,
}: {
  walkBefore: number
  routeId: string
  walkAfter?: number
}) {
  return (
    <div className="mv-timeline-flow">
      <MvWalkChip minutes={walkBefore} />
      <span className="mv-flow-arrow">›</span>
      <MvTransitChip routeId={routeId} />
      {walkAfter != null && walkAfter > 0 && (
        <>
          <span className="mv-flow-arrow">›</span>
          <MvWalkChip minutes={walkAfter} />
        </>
      )}
    </div>
  )
}

export function MvFilterButton() {
  return (
    <button type="button" className="mv-filter-btn">
      <Filter className="h-4 w-4" />
      Bộ lọc
    </button>
  )
}
