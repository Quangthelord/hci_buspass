export const KIOSK_ORIENTATION_KEY = 'kioskOrientation'
export type KioskOrientation = 'portrait' | 'landscape'

export const KIOSK_DIMENSIONS = {
  portrait: { width: 1080, height: 1920 },
  landscape: { width: 1920, height: 1080 },
} as const

export function getKioskOrientation(): KioskOrientation {
  const v = localStorage.getItem(KIOSK_ORIENTATION_KEY)
  return v === 'landscape' ? 'landscape' : 'portrait'
}

export function setKioskOrientation(o: KioskOrientation) {
  localStorage.setItem(KIOSK_ORIENTATION_KEY, o)
}
