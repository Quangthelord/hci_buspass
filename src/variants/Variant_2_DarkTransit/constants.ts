/** Citymapper design tokens */
export const CM = {
  green: '#3CB44A',
  greenDark: '#2B9E3F',
  greenPanel: '#3CB44A',
  purple: '#7B4397',
  slate: '#2E3A4D',
  slateCard: '#3A4A63',
  white: '#FFFFFF',
  mapBg: '#EEF1F4',
  mapRoad: '#FFFFFF',
  mapPark: '#C8E6C9',
  routeOrange: '#FF8C00',
  routeGreen: '#3CB44A',
  routeBlue: '#2A81F6',
  text: '#1C1C1C',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  cardBorder: '#E8EAED',
  liveSignal: '#F5C518',
  alertBlue: '#2A81F6',
  warning: '#F59E0B',
  subwayYellow: '#F5C518',
  subwayGreen: '#3CB44A',
  subwayRed: '#E74C3C',
} as const

export type CmScreen = 'home' | 'planner' | 'routeDetail' | 'goMode'

export const VARIANT_ID = 'Variant_2_DarkTransit' as const

/** Citymapper home mode grid — 2 rows like the app */
export const HOME_MODES = [
  { id: 'all', label: 'All', row: 1 },
  { id: 'walk', label: 'Walk', row: 1 },
  { id: 'bike', label: 'Bike', row: 1 },
  { id: 'maps', label: 'Maps', row: 1 },
  { id: 'issues', label: 'Issues', row: 1, warn: true },
  { id: 'subway', label: 'Metro', row: 2 },
  { id: 'bus', label: 'Bus', row: 2, default: true },
  { id: 'rail', label: 'Rail', row: 2 },
  { id: 'scooter', label: 'Scooter', row: 2 },
  { id: 'more', label: 'More', row: 2 },
] as const

export const DARK = CM
