import type { BusRouteData } from '../data/busRoutes'

/** Standard usability-test goal: find a bus to Suối Tiên from Bến Thành. */
export const TASK_DESTINATION = 'Suối Tiên'

export function getRouteDestination(route: BusRouteData): string {
  return route.stops[route.stops.length - 1]?.name ?? ''
}

export function matchesTaskDestination(
  route: BusRouteData,
  displayDestination?: string,
): boolean {
  const label = (displayDestination ?? getRouteDestination(route)).toLowerCase()
  const terminal = getRouteDestination(route).toLowerCase()
  const goal = TASK_DESTINATION.toLowerCase()
  return label.includes(goal) || terminal.includes(goal)
}
