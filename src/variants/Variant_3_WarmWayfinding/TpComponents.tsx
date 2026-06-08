import {
  ArrowLeft,
  ArrowLeftRight,
  Bus,
  ChevronRight,
  Crosshair,
  Footprints,
  Heart,
  MapPin,
  Menu,
  MoreHorizontal,
  RefreshCw,
  Route,
  Settings,
  User,
} from 'lucide-react'
import type { ReactNode } from 'react'
import type { TpTab } from './constants'

export function TpHeader({
  title,
  onBack,
  onMenu,
  showBack,
}: {
  title: string
  onBack?: () => void
  onMenu?: () => void
  showBack?: boolean
}) {
  return (
    <header className="tp-header shrink-0">
      {showBack ? (
        <button type="button" className="tp-header-btn" onClick={onBack} aria-label="Back">
          <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
        </button>
      ) : (
        <button type="button" className="tp-header-btn" onClick={onMenu} aria-label="Menu">
          <Menu className="h-5 w-5" strokeWidth={2.5} />
        </button>
      )}
      <h1 className="tp-header-title">{title}</h1>
      <button type="button" className="tp-header-btn" aria-label="Account">
        <User className="h-5 w-5" strokeWidth={2} />
      </button>
    </header>
  )
}

export function TpBottomNav({
  active,
  onPlaces,
  onJourneys,
  onRoutes,
}: {
  active: TpTab
  onPlaces: () => void
  onJourneys: () => void
  onRoutes: () => void
}) {
  const items: { id: TpTab; label: string; icon: ReactNode }[] = [
    { id: 'places', label: 'Places', icon: <MapPin className="h-5 w-5" strokeWidth={2} /> },
    { id: 'journeys', label: 'Journeys', icon: <MoreHorizontal className="h-5 w-5" strokeWidth={2} /> },
    { id: 'routes', label: 'Routes', icon: <Route className="h-5 w-5" strokeWidth={2} /> },
  ]

  return (
    <nav className="tp-bottom-nav">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`tp-nav-item ${active === item.id ? 'tp-nav-item--active' : ''}`}
          onClick={
            item.id === 'places' ? onPlaces : item.id === 'journeys' ? onJourneys : onRoutes
          }
        >
          {item.icon}
          {item.label}
          {active === item.id && <span className="tp-nav-dot" />}
        </button>
      ))}
    </nav>
  )
}

export function TpCardChevron() {
  return (
    <span className="tp-card-chevron">
      <ChevronRight className="h-4 w-4" strokeWidth={3} />
    </span>
  )
}

export function TpFieldActions() {
  return (
    <span className="tp-field-actions">
      <Crosshair className="h-5 w-5" strokeWidth={2} />
      <Heart className="h-5 w-5" strokeWidth={2} />
    </span>
  )
}

export function TpJourneyFlow({
  walkBefore,
  routeId,
  walkAfter,
}: {
  walkBefore: number
  routeId: string
  walkAfter: number
}) {
  return (
    <div className="tp-journey-flow">
      <div className="tp-flow-seg">
        <span className="tp-flow-icon">
          <Footprints className="h-4 w-4" strokeWidth={2.5} />
        </span>
        <span className="tp-flow-walk-m">{walkBefore}m</span>
      </div>
      <span className="tp-flow-line" />
      <div className="tp-flow-bus">
        <span className="tp-flow-icon">
          <Bus className="h-4 w-4" strokeWidth={2.5} />
        </span>
        <span className="tp-flow-bus-num">{routeId}</span>
      </div>
      <span className="tp-flow-line" />
      <div className="tp-flow-seg">
        <span className="tp-flow-icon">
          <Footprints className="h-4 w-4" strokeWidth={2.5} />
        </span>
        <span className="tp-flow-walk-m">{walkAfter}m</span>
      </div>
    </div>
  )
}

export function TpJourneySummary({
  walkBefore,
  routeId,
  walkAfter,
}: {
  walkBefore: number
  routeId: string
  walkAfter: number
}) {
  return (
    <div className="tp-journey-summary shrink-0">
      <span className="tp-summary-pin" style={{ background: '#00703C' }} />
      <span className="tp-summary-conn" />
      <div className="tp-summary-seg">
        <span className="tp-summary-icon">
          <Footprints className="h-3.5 w-3.5" />
        </span>
        <span className="text-[0.625rem] text-[#666]">{walkBefore}m</span>
      </div>
      <span className="tp-summary-conn" />
      <div className="tp-summary-seg">
        <span className="tp-summary-icon">
          <Bus className="h-3.5 w-3.5" />
        </span>
        <span className="text-[0.625rem] font-bold">{routeId}</span>
      </div>
      <span className="tp-summary-conn" />
      <div className="tp-summary-seg">
        <span className="tp-summary-icon">
          <Footprints className="h-3.5 w-3.5" />
        </span>
        <span className="text-[0.625rem] text-[#666]">{walkAfter}m</span>
      </div>
      <span className="tp-summary-conn" />
      <span className="tp-summary-pin" style={{ background: '#D32F2F' }} />
    </div>
  )
}

export function TpSwapButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="p-2 text-white/80" aria-label="Swap">
      <ArrowLeftRight className="h-5 w-5" />
    </button>
  )
}

export function TpLiveHeader({
  routeId,
  onBack,
  onRefresh,
}: {
  routeId: string
  onBack: () => void
  onRefresh?: () => void
}) {
  return (
    <header className="tp-header shrink-0">
      <button type="button" className="tp-header-btn" onClick={onBack}>
        <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
      </button>
      <h1 className="tp-header-title">Bus {routeId}</h1>
      <div className="flex">
        <button type="button" className="tp-header-btn" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
        </button>
        <button type="button" className="tp-header-btn">
          <User className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}

export function TpOptionsBar() {
  return (
    <div className="tp-action-bar shrink-0">
      <button type="button" className="tp-action-btn">
        <Settings className="h-4 w-4" />
        OPTIONS
      </button>
      <button type="button" className="tp-action-btn">
        <Heart className="h-4 w-4 text-[#00703C]" />
        SAVED JOURNEY
      </button>
    </div>
  )
}
