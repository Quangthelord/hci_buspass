/** Citymapper design tokens */
export const CM = {
  green: '#37B24D',
  greenDark: '#2F9E44',
  greenBg: '#E8F5E9',
  slate: '#2D3A4F',
  slateLight: '#3D4F66',
  white: '#FFFFFF',
  mapBg: '#F0F2F5',
  mapRoad: '#FFFFFF',
  mapPark: '#D4EDDA',
  routeOrange: '#FF8C00',
  routeBlue: '#2A81F6',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  cardBorder: '#E5E7EB',
  liveSignal: '#FFC107',
  alertBlue: '#2A81F6',
} as const

export type CmScreen = 'home' | 'planner' | 'routeDetail' | 'goMode'

export const VARIANT_ID = 'Variant_2_DarkTransit' as const

export const TRANSPORT_MODES = [
  { id: 'all', label: 'All', icon: 'grid' },
  { id: 'walk', label: 'Walk', icon: 'walk' },
  { id: 'bus', label: 'Bus', icon: 'bus' },
  { id: 'rail', label: 'Rail', icon: 'rail' },
  { id: 'subway', label: 'Metro', icon: 'subway' },
  { id: 'more', label: 'More', icon: 'more' },
] as const

/** @deprecated use CM — kept for any stale imports */
export const DARK = {
  bg: CM.slate,
  card: CM.slateLight,
  cyan: CM.routeBlue,
  purple: '#7B2FBE',
  text: '#E2E8F0',
  muted: '#94A3B8',
  grid: '#2D3748',
} as const
