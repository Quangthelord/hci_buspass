/** TransPerth design tokens — Variant C */
export const TP = {
  green: '#00703C',
  greenDark: '#005A30',
  greenLight: '#00843D',
  yellow: '#FFC20E',
  yellowDark: '#E6AD00',
  yellowGradient: 'linear-gradient(180deg, #FFD54F 0%, #FFC20E 55%, #FFB300 100%)',
  bg: '#F5F5F5',
  card: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#555555',
  textMuted: '#888888',
  border: '#E0E0E0',
  link: '#00703C',
  linkBlue: '#1565C0',
  liveOrange: '#FF6600',
  mapBg: '#EDE8E0',
  mapRoad: '#FFFFFF',
  mapRoute: '#00703C',
  pinGreen: '#00703C',
  pinRed: '#D32F2F',
  pinGrey: '#616161',
  chevronBar: 'linear-gradient(180deg, #FFD54F 0%, #FFC20E 100%)',
} as const

export type TpScreen = 'places' | 'stopsNearMe' | 'planner' | 'journey' | 'liveBus'
export type TpTab = 'places' | 'journeys' | 'routes'

export const VARIANT_ID = 'Variant_3_WarmWayfinding' as const

export const STATUS_PILL = {
  on_time: { bg: '#E8F5E9', text: '#2E7D32', label: 'On time' },
  minor: { bg: '#FFF8E1', text: '#F57F17', label: 'Minor delay' },
  major: { bg: '#FFEBEE', text: '#C62828', label: 'Major delay' },
  unknown: { bg: '#F5F5F5', text: '#616161', label: 'Updating' },
} as const

/** Full incident copy for "MORE INFO" — transparency in uncertainty. */
export const INCIDENT_DETAILS: Record<string, string> = {
  '01':
    'Bus running ~2 min behind schedule due to light congestion at Ngã tư Hàng Xanh. ' +
    'Route unchanged — operations monitoring the situation.',
  '02':
    'Service on schedule. GPS confirms bus approaching Bến Thành normally.',
  '08':
    'Location data temporarily unstable. Fixed timetable still available below.',
  '36':
    'Heavy congestion at An Sương interchange. Wait may be 10–15 min longer than usual.',
}

export const FAVOURITE_PLACES = [
  { id: 'home', name: 'Home', address: 'Bến Thành, Quận 1' },
  { id: 'uni', name: 'Uni', address: 'Đại học Quốc gia, TP.HCM' },
  { id: 'work', name: 'Work', address: 'Suối Tiên, Quận 9' },
] as const
