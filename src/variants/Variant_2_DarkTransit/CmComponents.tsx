import { AlertTriangle, Footprints, Radio } from 'lucide-react'
import type { BusRouteData } from '../../data/busRoutes'
import { getArrivalMinutes, getDestination, getTripMinutes } from './utils'

export function CmLogo({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const text = size === 'sm' ? 'text-sm' : 'text-lg'
  return (
    <div className="flex items-center gap-1.5">
      <svg width={size === 'sm' ? 20 : 28} height={size === 'sm' ? 20 : 28} viewBox="0 0 28 28" aria-hidden>
        <circle cx="14" cy="14" r="13" fill="#3CB44A" />
        <circle cx="10" cy="12" r="2" fill="#1C1C1C" />
        <circle cx="18" cy="12" r="2" fill="#1C1C1C" />
        <path d="M10 18 Q14 21 18 18" stroke="#1C1C1C" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
      <span className={`${text} font-extrabold tracking-tight text-[#3CB44A]`}>Citymapper</span>
    </div>
  )
}

export function CmLiveSignal({ className = '' }: { className?: string }) {
  return (
    <span className={`cm-live-signal inline-flex ${className}`} title="Live">
      <Radio className="h-3.5 w-3.5" strokeWidth={2.5} />
    </span>
  )
}

export function CmBusPill({ id, size = 'md' }: { id: string; size?: 'sm' | 'md' | 'lg' }) {
  const cls =
    size === 'lg' ? 'cm-bus-pill cm-bus-pill--lg' : size === 'sm' ? 'cm-bus-pill cm-bus-pill--sm' : 'cm-bus-pill'
  return <span className={cls}>{id}</span>
}

export function CmRouteSequence({ routeId, dest }: { routeId: string; dest: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Footprints className="h-4 w-4 text-[#2A81F6]" strokeWidth={2.5} />
      <span className="text-[#9CA3AF]">›</span>
      <CmBusPill id={routeId} size="sm" />
      <span className="text-[#9CA3AF]">›</span>
      <Footprints className="h-4 w-4 text-[#2A81F6]" strokeWidth={2.5} />
      <span className="ml-1 truncate text-sm text-[#6B7280]">→ {dest}</span>
    </div>
  )
}

export function CmTrainBestSection() {
  const cars = ['', '', '█', '', '']
  return (
    <div className="cm-train-section">
      <p className="text-xs font-bold uppercase tracking-wide text-[#3CB44A]">Best Section — Middle</p>
      <div className="mt-2 flex items-center gap-1">
        {cars.map((c, i) => (
          <div
            key={i}
            className={`cm-train-car ${c ? 'cm-train-car--best' : ''}`}
          />
        ))}
      </div>
      <p className="mt-1.5 text-xs text-[#6B7280]">Stand at middle doors for fastest exit</p>
    </div>
  )
}

export function CmEtaBubble({ minutes, large }: { minutes: number | number[]; large?: boolean }) {
  const label = Array.isArray(minutes)
    ? `in ${minutes.join(', ')} min`
    : minutes <= 0
      ? 'Arr'
      : `in ${minutes} min`
  return (
    <div className={`cm-eta-bubble ${large ? 'cm-eta-bubble--lg' : ''}`}>
      <CmLiveSignal />
      <span className="font-bold">{label}</span>
    </div>
  )
}

export function CmSuggestedRow({
  route,
  start,
  onSelect,
}: {
  route: BusRouteData
  start: string
  onSelect: () => void
}) {
  const mins = getTripMinutes(route)
  const wait = getArrivalMinutes(route)
  const dest = getDestination(route)
  const next2 = wait + Math.max(5, route.stops[0].nextNextArrival - route.stops[0].nextArrival)

  return (
    <button type="button" onClick={onSelect} className="cm-suggested-card w-full p-4 text-left">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <CmRouteSequence routeId={route.id} dest={dest} />
          <p className="mt-2 text-sm text-[#6B7280]">
            <CmLiveSignal className="mr-1" />
            in {wait}, {next2} min from {start}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xl font-extrabold tabular-nums leading-none">{mins}</p>
          <p className="text-xs font-semibold text-[#6B7280]">min</p>
        </div>
      </div>
    </button>
  )
}

export function CmIssuesBadge() {
  return (
    <span className="cm-issues-badge">
      <AlertTriangle className="h-3 w-3" />
    </span>
  )
}
