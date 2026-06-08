/** Moovit design tokens — Variant D */
export const MV = {
  orange: '#F26722',
  orangeDark: '#D95A1C',
  header: '#2B2B2B',
  headerField: '#FFFFFF',
  bg: '#F0F0F0',
  card: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#666666',
  textMuted: '#999999',
  divider: '#E0E0E0',
  busGreen: '#4CAF50',
  busBlue: '#2196F3',
  busLineGreen: '#43A047',
  busLineBlue: '#1E88E5',
  pinRed: '#E53935',
  mapBg: '#E8EDF2',
  mapRoad: '#FFFFFF',
  mapPark: '#C8E6C9',
  timeBar: '#3D3D3D',
  navInactive: '#757575',
} as const

export type MvScreen = 'nearby' | 'planner' | 'routeDetail'

export const VARIANT_ID = 'Variant_4_MetroMinimal' as const

export const ORIGIN_ADDRESS =
  'Nguyễn Du, Phường Bến Thành, Quận 1, Hồ Chí Minh, Việt Nam'
