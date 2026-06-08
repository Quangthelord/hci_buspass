import type { BusRouteData } from '../data/busRoutes'

/** Standard usability-test goal: find a bus to Suối Tiên from Bến Thành. */
export const TASK_DESTINATION = 'Suối Tiên'

/** Primary route ID for moderated test (Bến Thành → Suối Tiên). */
export const TASK_ROUTE_ID = '01'

export function getRouteDestination(route: BusRouteData): string {
  return route.stops[route.stops.length - 1]?.name ?? ''
}

/** Match only on actual terminal stop from route data — never UI overrides. */
export function matchesTaskDestination(route: BusRouteData): boolean {
  const terminal = getRouteDestination(route).toLowerCase()
  return terminal.includes(TASK_DESTINATION.toLowerCase())
}

export function findTaskRoute(routes: BusRouteData[]): BusRouteData | undefined {
  return routes.find(matchesTaskDestination)
}
