import type { Lang } from './mockData'

export type AlertSeverity = 'info' | 'warning' | 'critical'

export interface KioskAlert {
  id: string
  severity: AlertSeverity
  title: Record<Lang, string>
  message: Record<Lang, string>
}

export const LIVE_ALERTS: KioskAlert[] = [
  {
    id: 'congestion-cmt8',
    severity: 'warning',
    title: {
      vi: 'Ùn tắc nhẹ',
      en: 'Light congestion',
      zh: '轻微拥堵',
      ko: '약간 정체',
    },
    message: {
      vi: 'Ngã tư Cách Mạng Tháng 8 — Tuyến 19 trễ 3–5 phút',
      en: 'CMT8 intersection — Route 19 delayed 3–5 min',
      zh: '八月革命路口 — 19路延误3-5分钟',
      ko: '8월 혁명 교차로 — 19번 3-5분 지연',
    },
  },
  {
    id: 'rain',
    severity: 'info',
    title: {
      vi: 'Thời tiết',
      en: 'Weather',
      zh: '天气',
      ko: '날씨',
    },
    message: {
      vi: 'Mưa nhẹ — Lái xe đi chậm, chờ thêm 2–3 phút',
      en: 'Light rain — Buses slower, allow 2–3 extra min',
      zh: '小雨 — 公交减速，请多等2-3分钟',
      ko: '가벼운 비 — 버스 지연 2-3분',
    },
  },
  {
    id: 'route36-delay',
    severity: 'warning',
    title: {
      vi: 'Trễ tuyến',
      en: 'Route delay',
      zh: '线路延误',
      ko: '노선 지연',
    },
    message: {
      vi: 'Tuyến 36: Xe tiếp theo trễ ~8 phút do kẹt xe An Sương',
      en: 'Route 36: Next bus ~8 min late due to An Suong traffic',
      zh: '36路：安松拥堵，下一班约延误8分钟',
      ko: '36번: 안수엉 정체로 약 8분 지연',
    },
  },
]
