import type { BusRouteData } from '../../data/busRoutes'
import { findTaskRoute, getRouteDestination } from '../../lib/taskGoal'

export function getDestination(route: BusRouteData): string {
  return getRouteDestination(route) || '—'
}

export function getArrivalMinutes(route: BusRouteData): number {
  const stop = route.stops[0]
  if (!stop) return 0
  return Math.max(0, stop.nextArrival + route.currentDelay)
}

export function getTripMinutes(route: BusRouteData): number {
  const last = route.stops[route.stops.length - 1]
  if (!last) return getArrivalMinutes(route)
  return last.nextArrival + route.currentDelay
}

export function formatArriveTime(minutesFromNow: number): string {
  const d = new Date(Date.now() + minutesFromNow * 60_000)
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export function buildSuggestions(routes: BusRouteData[], destinationQuery: string): BusRouteData[] {
  const q = destinationQuery.trim().toLowerCase()
  const task = findTaskRoute(routes)
  const sorted = [...routes].sort((a, b) => getTripMinutes(a) - getTripMinutes(b))

  if (!q) return sorted

  const matched = sorted.filter(
    (r) =>
      r.id.includes(q) ||
      r.name.toLowerCase().includes(q) ||
      getDestination(r).toLowerCase().includes(q),
  )

  if (task && !matched.some((r) => r.id === task.id)) {
    return [task, ...matched]
  }
  return matched.length > 0 ? matched : sorted
}
