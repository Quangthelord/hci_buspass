export const METRO = {
  bg: '#F1F5F9',
  primary: '#2563EB',
  card: '#FFFFFF',
  text: '#1E293B',
  muted: '#64748B',
  inactive: '#94A3B8',
  activeStep: '#DBEAFE',
  cardShadow: '0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.06)',
  mapGrid: '#E2E8F0',
} as const

export const VARIANT_ID = 'Variant_4_MetroMinimal' as const

export const FLOW_STEPS = [
  { step: 1, name: 'destination-search', label: 'Bạn muốn đi đâu?' },
  { step: 2, name: 'route-select', label: 'Chọn tuyến phù hợp' },
  { step: 3, name: 'journey', label: 'Hành trình của bạn' },
] as const
