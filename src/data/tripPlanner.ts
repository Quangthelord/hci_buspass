import { DESTINATIONS, ROUTES, STATION, getRoute, type Lang } from './mockData'

export type TripCriteria = 'fastest' | 'cheapest' | 'leastTransfers'
export type TransportMode = 'bus' | 'metro' | 'grab' | 'walk'

export interface TripLeg {
  mode: TransportMode
  label: string
  durationMin: number
  detail?: string
}

export interface TripPlan {
  id: string
  criteria: TripCriteria
  criteriaLabel: Record<Lang, string>
  totalMinutes: number
  totalFare: number
  transfers: number
  legs: TripLeg[]
  primaryRouteId: string
  badge?: Record<Lang, string>
}

function destName(destId: string, lang: Lang): string {
  const d = DESTINATIONS.find((x) => x.id === destId)
  if (!d) return destId
  return lang === 'vi' ? d.nameVi : d.nameEn
}

function buildDirectPlan(
  destId: string,
  routeId: string,
  criteria: TripCriteria,
  lang: Lang,
  walkMin: number,
): TripPlan {
  const route = getRoute(routeId)!
  const labels: Record<TripCriteria, Record<Lang, string>> = {
    fastest: { vi: 'Nhanh nhất', en: 'Fastest', zh: '最快', ko: '최단 시간' },
    cheapest: { vi: 'Rẻ nhất', en: 'Cheapest', zh: '最便宜', ko: '최저가' },
    leastTransfers: { vi: 'Ít đổi tuyến', en: 'Fewest transfers', zh: '最少换乘', ko: '최소 환승' },
  }
  return {
    id: `${criteria}-${routeId}-${destId}`,
    criteria,
    criteriaLabel: labels[criteria],
    totalMinutes: route.etaMinutes + walkMin,
    totalFare: route.fare,
    transfers: 0,
    primaryRouteId: routeId,
    legs: [
      {
        mode: 'walk',
        label: lang === 'vi' ? 'Đi bộ tới trạm' : 'Walk to stop',
        durationMin: walkMin,
        detail: STATION.nameVi,
      },
      {
        mode: 'bus',
        label: lang === 'vi' ? `Tuyến ${route.number}` : `Route ${route.number}`,
        durationMin: route.etaMinutes + Math.round(destId === 'airport' ? 25 : 12),
        detail: `${route.from} → ${destName(destId, lang)}`,
      },
      {
        mode: 'walk',
        label: lang === 'vi' ? 'Đi bộ tới đích' : 'Walk to destination',
        durationMin: 3,
      },
    ],
  }
}

function buildComboPlan(destId: string, lang: Lang): TripPlan {
  const isVi = lang === 'vi'
  return {
    id: `combo-${destId}`,
    criteria: 'fastest',
    criteriaLabel: { vi: 'Kết hợp', en: 'Multimodal', zh: '联运', ko: '복합' },
    totalMinutes: 42,
    totalFare: 25000,
    transfers: 1,
    primaryRouteId: '05',
    badge: { vi: 'Đề xuất sân bay', en: 'Airport pick', zh: '机场推荐', ko: '공항 추천' },
    legs: [
      { mode: 'walk', label: isVi ? 'Tại trạm hiện tại' : 'From this stop', durationMin: 0 },
      {
        mode: 'bus',
        label: isVi ? 'Tuyến 05 (tốc độ cao)' : 'Route 05 (express)',
        durationMin: 18,
      },
      {
        mode: 'metro',
        label: isVi ? 'Metro Bến Thành → Sân bay' : 'Metro Ben Thanh → Airport',
        durationMin: 15,
        detail: 'Line 2 (planned connection mock)',
      },
      {
        mode: 'grab',
        label: isVi ? 'Grab nối chặng cuối (tuỳ chọn)' : 'Grab last mile (optional)',
        durationMin: 9,
        detail: isVi ? 'Nếu metro chưa kết nối trực tiếp' : 'If metro not direct',
      },
    ],
  }
}

/** Mock trip planner: origin = current station */
export function planTrips(destinationId: string, lang: Lang): TripPlan[] {
  const dest = DESTINATIONS.find((d) => d.id === destinationId)
  if (!dest) return []

  const routeIds = dest.routes.filter((id) => ROUTES.some((r) => r.id === id))
  const sorted = [...routeIds].sort((a, b) => {
    const ra = getRoute(a)!
    const rb = getRoute(b)!
    return ra.etaMinutes - rb.etaMinutes
  })

  const fastestId = sorted[0] ?? '19'
  const cheapestId = [...routeIds].sort(
    (a, b) => getRoute(a)!.fare - getRoute(b)!.fare,
  )[0] ?? fastestId
  const directId =
    routeIds.length > 1
      ? routeIds.reduce((best, id) =>
          getRoute(id)!.stops.length < getRoute(best)!.stops.length ? id : best,
        )
      : fastestId

  const plans: TripPlan[] = [
    buildDirectPlan(destinationId, fastestId, 'fastest', lang, 2),
    buildDirectPlan(destinationId, cheapestId, 'cheapest', lang, 4),
    buildDirectPlan(destinationId, directId, 'leastTransfers', lang, 2),
  ]

  if (destinationId === 'airport') {
    plans[0] = buildComboPlan(destinationId, lang)
    plans[0].criteria = 'fastest'
  }

  // Deduplicate by id
  const seen = new Set<string>()
  return plans.filter((p) => {
    if (seen.has(p.criteria)) return false
    seen.add(p.criteria)
    return true
  })
}

export const CRITERIA_ORDER: TripCriteria[] = ['fastest', 'cheapest', 'leastTransfers']
