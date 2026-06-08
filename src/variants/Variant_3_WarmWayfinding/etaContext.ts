import type { BusRouteData } from '../../data/busRoutes'
import { getRealtimeRoutes } from '../../lib/mockRealtime'
import { INCIDENT_DETAILS } from './constants'

export type UncertaintyStatus = 'on_time' | 'minor' | 'major' | 'unknown'

export interface EtaContext {
  status: UncertaintyStatus
  etaLabel: string
  contextLabel: string
  fullLine: string
  reason: string | null
  incidentDetails: string
}

function formatRange(min: number, max: number): string {
  return `${min}–${max} phút`
}

/** Transperth-style "Transparency in Uncertainty" ETA copy. */
export function getEtaContext(route: BusRouteData): EtaContext {
  const base = route.stops[0]?.nextArrival ?? 0
  const delay = route.currentDelay

  if (route.id === '08') {
    return {
      status: 'unknown',
      etaLabel: 'Chưa có dữ liệu',
      contextLabel: 'Hệ thống đang cập nhật',
      fullLine: 'Chưa có dữ liệu · Hệ thống đang cập nhật',
      reason: null,
      incidentDetails:
        INCIDENT_DETAILS['08'] ??
        'Chúng tôi đang lấy lại tín hiệu GPS. Vui lòng tham khảo lịch cố định nếu cần.',
    }
  }

  if (delay === 0) {
    const eta = `${base} phút`
    return {
      status: 'on_time',
      etaLabel: eta,
      contextLabel: 'Đúng lịch',
      fullLine: `${eta} · Đúng lịch`,
      reason: null,
      incidentDetails:
        INCIDENT_DETAILS[route.id] ??
        'Xe buýt đang chạy đúng tiến độ. Không có sự cố được báo cáo trên tuyến.',
    }
  }

  if (delay >= 7) {
    const min = base + delay
    const max = min + 8
    const location = route.delayReason ?? 'trên tuyến'
    const reason = `${location} — đang điều phối`
    return {
      status: 'major',
      etaLabel: formatRange(min, max),
      contextLabel: reason,
      fullLine: `${formatRange(min, max)} · ${reason}`,
      reason: route.delayReason,
      incidentDetails:
        INCIDENT_DETAILS[route.id] ??
        `Đội vận hành đang xử lý sự cố tại ${location}. Cảm ơn bạn đã kiên nhẫn chờ.`,
    }
  }

  const min = base + Math.max(delay - 1, 0)
  const max = base + delay + 3
  const location = route.delayReason ?? 'trên tuyến'
  return {
    status: 'minor',
    etaLabel: formatRange(min, max),
    contextLabel: location,
    fullLine: `${formatRange(min, max)} · ${location}`,
    reason: route.delayReason,
    incidentDetails:
      INCIDENT_DETAILS[route.id] ??
      `Xe chậm hơn dự kiến do ${location}. Thời gian có thể thay đổi thêm vài phút.`,
  }
}

export function getArrivalMinutes(route: BusRouteData): number {
  return route.stops[0].nextArrival + route.currentDelay
}

export function routesAtStation(stationName = 'Bến Thành'): BusRouteData[] {
  return getRealtimeRoutes().filter((r) => r.stops[0]?.name === stationName)
}
