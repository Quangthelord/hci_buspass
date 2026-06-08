import {
  Bell,
  Bus,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  CloudSun,
  Info,
  MapPin,
  Menu,
  RefreshCw,
  Search,
  Star,
  TrainFront,
  X,
  Home,
  ArrowLeft,
  Accessibility,
} from 'lucide-react'
import type { BusRouteData } from '../../data/busRoutes'
import { MT } from './constants'
import {
  formatArrivalLabel,
  getArrivalMinutes,
  getDestination,
  getLoadLevel,
  isDoubleDeck,
} from './utils'

export function MtLogo() {
  return (
    <svg className="mt-sg-logo-icon" viewBox="0 0 32 32" fill="none" aria-hidden>
      <path
        d="M8 16C8 11.58 11.58 8 16 8C20.42 8 24 11.58 24 16C24 20.42 20.42 24 16 24"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M16 8C11.58 8 8 11.58 8 16C8 20.42 11.58 24 16 24C20.42 24 24 20.42 24 16"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        transform="rotate(90 16 16)"
      />
    </svg>
  )
}

export function MtAppHeader({ onMenu }: { onMenu?: () => void }) {
  return (
    <header className="mt-sg-app-header flex shrink-0 items-center justify-between px-4 py-3">
      <button type="button" onClick={onMenu} className="p-1 text-[#212121]" aria-label="Menu">
        <Menu className="h-6 w-6" strokeWidth={2} />
      </button>
      <div className="flex items-center gap-2">
        <MtLogo />
        <span className="mt-sg-logo-text">MyTransport.SG</span>
      </div>
      <div className="flex items-center gap-1 text-sm font-semibold text-[#757575]">
        <CloudSun className="h-5 w-5 text-[#FF9800]" />
        <span>28-35°C</span>
      </div>
    </header>
  )
}

export function MtAnnouncementsBar({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="mt-sg-announce flex w-full items-center gap-2 px-4 py-2.5">
      <span className="text-[#E65100]">📢</span>
      <span className="flex-1 text-left text-sm font-semibold text-[#E65100]">Announcements</span>
      <span className="mt-sg-announce-badge">{count}</span>
      <ChevronRight className="h-4 w-4 text-[#E65100]" />
    </button>
  )
}

export function MtSearchBar({
  value,
  onChange,
  placeholder = 'Address, bus stop or bus number',
}: {
  value: string
  onChange: (q: string) => void
  placeholder?: string
}) {
  return (
    <div className="mt-sg-search mx-4 flex items-center gap-3 px-4 py-3">
      <Search className="h-5 w-5 shrink-0 text-[#9E9E9E]" strokeWidth={2} />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 border-none bg-transparent text-base text-[#212121] outline-none placeholder:text-[#9E9E9E]"
      />
    </div>
  )
}

export function MtModeToggle({
  mode,
  onChange,
}: {
  mode: 'bus' | 'mrt'
  onChange: (m: 'bus' | 'mrt') => void
}) {
  return (
    <div className="mt-sg-mode-toggle">
      <button
        type="button"
        className={`mt-sg-mode-btn ${mode === 'bus' ? 'mt-sg-mode-btn--active' : ''}`}
        onClick={() => onChange('bus')}
      >
        <Bus className={`h-7 w-7 ${mode === 'bus' ? 'text-[#212121]' : 'text-[#9E9E9E]'}`} strokeWidth={1.75} />
        BUS
      </button>
      <button
        type="button"
        className={`mt-sg-mode-btn ${mode === 'mrt' ? 'mt-sg-mode-btn--active' : ''}`}
        onClick={() => onChange('mrt')}
      >
        <TrainFront className={`h-7 w-7 ${mode === 'mrt' ? 'text-[#212121]' : 'text-[#9E9E9E]'}`} strokeWidth={1.75} />
        MRT/LRT
      </button>
    </div>
  )
}

export function MtDisclaimer() {
  return (
    <p className="px-4 py-2 text-xs leading-relaxed text-[#757575]">
      <Clock className="mr-1 inline h-3.5 w-3.5 text-[#FF9800]" />
      Bus arrival time is based on the schedule from operators and may be subject to change.{' '}
      <span className="text-[#1565C0]">View more information.</span>
    </p>
  )
}

function BusTypeIcon({ doubleDeck }: { doubleDeck: boolean }) {
  return (
    <svg width="22" height="14" viewBox="0 0 22 14" className="text-[#757575]" aria-hidden>
      <rect x="1" y="2" width="20" height={doubleDeck ? 10 : 8} rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {doubleDeck && <line x1="1" y1="7" x2="21" y2="7" stroke="currentColor" strokeWidth="1" />}
      <circle cx="5" cy="12" r="1.5" fill="currentColor" />
      <circle cx="17" cy="12" r="1.5" fill="currentColor" />
    </svg>
  )
}

function ArrivalColumn({
  minutes,
  load,
  faded,
  showWheelchair,
}: {
  minutes: number
  load: 'seats' | 'standing' | 'limited'
  faded?: boolean
  showWheelchair?: boolean
}) {
  return (
    <div className={`mt-sg-arrival-col ${faded ? 'mt-sg-arrival-col--faded' : ''}`}>
      <div className="mt-sg-bus-icon-wrap">
        <BusTypeIcon doubleDeck={false} />
        <div className={`mt-sg-load-under mt-sg-load-under--${load}`} />
      </div>
      <span className="mt-sg-arrival-time">{formatArrivalLabel(minutes)}</span>
      {showWheelchair && (
        <Accessibility className="mt-0.5 h-3.5 w-3.5 text-[#1976D2]" aria-label="Wheelchair accessible" />
      )}
    </div>
  )
}

export function MtServiceRow({
  route,
  starred,
  onSelect,
  onViewMap,
  showViewMap,
}: {
  route: BusRouteData
  starred?: boolean
  onSelect: () => void
  onViewMap?: () => void
  showViewMap?: boolean
}) {
  const m0 = getArrivalMinutes(route, 0)
  const m1 = getArrivalMinutes(route, 1)
  const m2 = getArrivalMinutes(route, 2)
  const doubleDeck = isDoubleDeck(route.id)

  return (
    <div className="mt-sg-service-row">
      <div className="flex items-center gap-2 px-4">
        <button type="button" className="shrink-0 text-[#BDBDBD]" aria-label="Favourite">
          <Star className={`h-5 w-5 ${starred ? 'fill-[#FFC107] text-[#FFC107]' : ''}`} />
        </button>
        <button type="button" onClick={onSelect} className="flex min-w-0 flex-1 items-center gap-2">
          <span className="mt-sg-service-badge">{route.id}</span>
          <Bell className="h-4 w-4 shrink-0 text-[#BDBDBD]" />
        </button>
        <div className="flex gap-3" onClick={onSelect} role="presentation">
          <ArrivalColumn
            minutes={m0}
            load={getLoadLevel(route.currentDelay, 0)}
            showWheelchair={route.id === '01'}
          />
          <ArrivalColumn minutes={m1} load={getLoadLevel(route.currentDelay, 1)} faded />
          <ArrivalColumn minutes={m2} load={getLoadLevel(route.currentDelay, 2)} faded />
        </div>
      </div>
      {showViewMap && onViewMap && (
        <button
          type="button"
          onClick={onViewMap}
          className="mt-2 flex w-full items-center justify-end gap-1 px-4 text-sm font-semibold text-[#1565C0]"
        >
          <MapPin className="h-4 w-4" />
          View on Map &gt;
        </button>
      )}
      <p className="sr-only">{getDestination(route)} — {doubleDeck ? 'double deck' : 'single deck'}</p>
    </div>
  )
}

export function MtBusStopCard({
  stopName,
  stopCode,
  street,
  distance,
  routes,
  expanded,
  onToggle,
  onSelectRoute,
  onViewMap,
  filterQuery,
}: {
  stopName: string
  stopCode: string
  street: string
  distance: string
  routes: BusRouteData[]
  expanded: boolean
  onToggle: () => void
  onSelectRoute: (route: BusRouteData) => void
  onViewMap: (route: BusRouteData) => void
  filterQuery: string
}) {
  const filtered = filterQuery
    ? routes.filter(
        (r) =>
          r.id.includes(filterQuery) ||
          getDestination(r).toLowerCase().includes(filterQuery.toLowerCase()) ||
          r.name.toLowerCase().includes(filterQuery.toLowerCase()),
      )
    : routes

  return (
    <div className="mt-sg-stop-card">
      <button type="button" className="mt-sg-stop-card-header" onClick={onToggle}>
        <Star className="h-5 w-5 shrink-0 text-[#BDBDBD]" />
        <div className="min-w-0 flex-1">
          <p className="font-bold text-[#212121]">{stopName}</p>
          <p className="text-sm text-[#757575]">
            {stopCode} | {street} | {distance}
          </p>
        </div>
        {expanded ? (
          <ChevronUp className="h-5 w-5 shrink-0 text-[#757575]" />
        ) : (
          <ChevronDown className="h-5 w-5 shrink-0 text-[#757575]" />
        )}
      </button>
      {expanded &&
        filtered.map((route, i) => (
          <MtServiceRow
            key={route.id}
            route={route}
            starred={route.id === '01'}
            onSelect={() => onSelectRoute(route)}
            onViewMap={() => onViewMap(route)}
            showViewMap={i === 0}
          />
        ))}
    </div>
  )
}

export function MtNearYouDrawer({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="mt-sg-near-you-drawer w-full shrink-0 py-4 text-center">
      <ChevronUp className="mx-auto mb-1 h-5 w-5 text-[#212121]" strokeWidth={2.5} />
      <span className="text-sm font-bold uppercase tracking-wide text-[#212121]">
        Near You (Bus stops)
      </span>
    </button>
  )
}

export function MtYellowHeader({
  title,
  onClose,
  onRefresh,
  rightIcon,
}: {
  title: string
  onClose: () => void
  onRefresh?: () => void
  rightIcon?: 'info' | 'home'
}) {
  return (
    <header className="mt-sg-yellow-header shrink-0 px-4 pb-3 pt-3">
      <div className="flex items-center justify-between">
        <button type="button" onClick={onClose} className="p-1" aria-label="Close">
          {rightIcon === 'home' ? (
            <ArrowLeft className="h-6 w-6" />
          ) : (
            <X className="h-6 w-6" />
          )}
        </button>
        <h1 className="text-base font-bold uppercase tracking-wide">{title}</h1>
        {onRefresh ? (
          <button type="button" onClick={onRefresh} className="p-1" aria-label="Refresh">
            <RefreshCw className="h-5 w-5" />
          </button>
        ) : rightIcon === 'home' ? (
          <button type="button" onClick={onClose} className="p-1" aria-label="Home">
            <Home className="h-5 w-5" />
          </button>
        ) : (
          <button type="button" className="p-1" aria-label="Info">
            <Info className="h-5 w-5" />
          </button>
        )}
      </div>
    </header>
  )
}

export function MtMapCanvas({ highlightRouteId }: { highlightRouteId?: string }) {
  return (
    <div className="mt-sg-map relative h-full w-full min-h-[200px]">
      <div className="mt-sg-map-road" style={{ top: '30%', left: '10%', width: '80%', height: '8%' }} />
      <div className="mt-sg-map-road" style={{ top: '55%', left: '20%', width: '60%', height: '6%', transform: 'rotate(-8deg)' }} />
      <div className="mt-sg-map-stop-pin absolute" style={{ top: '45%', left: '48%' }}>
        <Bus className="h-3 w-3" />
      </div>
      <div
        className={`mt-sg-map-bus-pin mt-sg-map-bus-pin--pulse absolute`}
        style={{ top: '28%', left: highlightRouteId === '01' ? '35%' : '60%' }}
      >
        <Bus className="h-4 w-4" />
      </div>
      <div className="mt-sg-map-bus-pin absolute opacity-60" style={{ top: '22%', left: '72%' }}>
        <Bus className="h-3.5 w-3.5" />
      </div>
      <button type="button" className="mt-sg-recenter-btn">
        <MapPin className="mr-1 inline h-4 w-4" />
        Recenter
      </button>
    </div>
  )
}

export { getDestination, MT }
