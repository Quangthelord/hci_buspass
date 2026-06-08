import type { BusRouteData } from '../../data/busRoutes'
import type { LoadLevel } from './constants'

export function getDestination(route: BusRouteData): string {
  return route.stops[route.stops.length - 1]?.name ?? '—'
}

export function getArrivalMinutes(route: BusRouteData, busIndex = 0): number {
  const stop = route.stops[0]
  if (!stop) return 0
  const gap = Math.max(stop.nextNextArrival - stop.nextArrival, 5)
  const bases = [stop.nextArrival, stop.nextNextArrival, stop.nextNextArrival + gap]
  return Math.max(0, (bases[busIndex] ?? bases[2]) + route.currentDelay)
}

export function getLoadLevel(delay: number, busIndex: number): LoadLevel {
  const score = delay + busIndex * 2
  if (score <= 1) return 'seats'
  if (score <= 4) return 'standing'
  return 'limited'
}

export function formatArrivalLabel(minutes: number): string {
  if (minutes <= 0) return 'Arr'
  if (minutes === 1) return '1 min'
  return `${minutes} min`
}

export function isDoubleDeck(routeId: string): boolean {
  const n = parseInt(routeId, 10)
  return Number.isFinite(n) ? n % 2 === 1 : false
}

export function filterRoutes(routes: BusRouteData[], query: string): BusRouteData[] {
  const q = query.trim().toLowerCase()
  if (!q) return routes
  return routes.filter(
    (r) =>
      r.id.includes(q) ||
      r.name.toLowerCase().includes(q) ||
      getDestination(r).toLowerCase().includes(q) ||
      r.stops.some((s) => s.name.toLowerCase().includes(q)),
  )
}
