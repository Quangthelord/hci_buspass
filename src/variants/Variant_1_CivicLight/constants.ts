/** MyTransport.SG design tokens (from LTA app reference) */
export const MT = {
  brandBlue: '#1565C0',
  brandBlueLight: '#42A5F5',
  yellow: '#FFC107',
  yellowDark: '#FFB300',
  yellowHeader: '#FFD54F',
  orangeAnnounce: '#FFF3E0',
  orangeText: '#E65100',
  orangeClock: '#FF9800',
  serviceGrey: '#424242',
  mapBlue: '#1976D2',
  linkBlue: '#1565C0',
  bg: '#FFFFFF',
  bgGrey: '#F5F5F5',
  tabInactive: '#EEEEEE',
  text: '#212121',
  textSecondary: '#757575',
  textMuted: '#9E9E9E',
  divider: '#E0E0E0',
  loadSeats: '#4CAF50',
  loadStanding: '#FFC107',
  loadLimited: '#F44336',
  starYellow: '#FFC107',
} as const

export type LoadLevel = 'seats' | 'standing' | 'limited'

export type MtScreen =
  | 'home'
  | 'nearYou'
  | 'liveMap'
  | 'busRoute'
  | 'mrt'
  | 'announcements'
  | 'journey'

export type TransportMode = 'bus' | 'mrt'

export const VARIANT_ID = 'Variant_1_CivicLight' as const

export const BUS_STOP_CODE = '01001'
export const BUS_STOP_STREET = 'Phan Chu Trinh'
export const BUS_STOP_DISTANCE = '120m'

export const ANNOUNCEMENTS = [
  {
    id: '1',
    tag: 'Bus Route Change',
    title: 'Cập nhật lịch trình tuyến 01 — Bến Thành ↔ Suối Tiên',
    date: 'Posted 8 Jun 2026 09:15',
    hasImage: true,
  },
  {
    id: '2',
    tag: 'Service Update',
    title: 'Thời gian đến theo lịch nhà xe, có thể thay đổi theo giao thông thực tế',
    date: 'Posted 1 Jun 2026 14:00',
    hasImage: false,
  },
] as const
