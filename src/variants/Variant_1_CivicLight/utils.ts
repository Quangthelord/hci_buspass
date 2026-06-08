import type { BusRouteData } from '../../data/busRoutes'
import type { LoadLevel } from './constants'

export function getDestination(route: BusRouteData): string {
  return route.stops[route.stops.length - 1]?.name ?? '—'
}

export function getArrivalMinutes(route: BusRouteData, busIndex = 0): number {
  const stop = route.stops[0]
  if (!stop) return 0
  const base = busIndex === 0 ? stop.nextArrival : stop.nextNextArrival
  return Math.max(0, base + route.currentDelay)
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
