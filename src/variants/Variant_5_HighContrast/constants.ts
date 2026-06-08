export const A11Y = {
  bg: '#FFFFFF',
  text: '#000000',
  buttonBg: '#000000',
  buttonText: '#FFFFFF',
  border: '#000000',
  status: {
    onTime: { text: '#166534', bg: '#F0FDF4', label: 'Đúng lịch' },
    delayed: { text: '#7C2D12', bg: '#FEF2F2', label: 'Trễ' },
    unknown: { text: '#1E3A5F', bg: '#EFF6FF', label: 'Chưa rõ' },
  },
} as const

export const VARIANT_ID = 'Variant_5_HighContrast' as const

export const BODY_STYLE = {
  fontSize: '20px',
  fontWeight: 700,
  letterSpacing: '0.02em',
} as const

export const TOUCH_MIN = '56px' as const

/** Curated display-board route order (destinations + ETAs from live data). */
export const BOARD_ROUTE_IDS = ['01', '02', '36'] as const
