/** LTA MyTransport.SG design tokens */
export const MT = {
  ltaGreen: '#009B3A',
  ltaGreenDark: '#007A2E',
  ltaGreenLight: '#E8F5E9',
  stopRed: '#D32F2F',
  mapBlue: '#1976D2',
  bg: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  divider: '#E0E0E0',
  loadSeats: '#00A651',
  loadStanding: '#F9A825',
  loadLimited: '#E53935',
  tabInactive: '#9E9E9E',
  bottomNav: '#FAFAFA',
} as const

export type LoadLevel = 'seats' | 'standing' | 'limited'

export const LOAD_LABEL: Record<LoadLevel, string> = {
  seats: 'Còn chỗ ngồi',
  standing: 'Còn chỗ đứng',
  limited: 'Đông / ít chỗ',
}

/** HCMC route colours mapped to SG-style service badges (green base + accent stripe) */
export const HCMC_ROUTE_COLORS: Record<string, string> = {
  '01': '#009B3A',
  '02': '#1565C0',
  '08': '#6A1B9A',
  '19': '#00838F',
  '36': '#EF6C00',
}

export const VARIANT_ID = 'Variant_1_CivicLight' as const

/** Mock SG-style bus stop code for Bến Thành */
export const BUS_STOP_CODE = '01001'
