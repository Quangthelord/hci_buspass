import { useEffect } from 'react'

/** Tự reset kiosk sau khi không có tương tác — bảo vệ quyền riêng tư người dùng trước. */
export function useKioskIdleReset(
  active: boolean,
  onIdle: () => void,
  timeoutMs = 60_000,
) {
  useEffect(() => {
    if (!active) return

    let timer = window.setTimeout(onIdle, timeoutMs)

    const bump = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(onIdle, timeoutMs)
    }

    window.addEventListener('pointerdown', bump)
    window.addEventListener('keydown', bump)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('pointerdown', bump)
      window.removeEventListener('keydown', bump)
    }
  }, [active, onIdle, timeoutMs])
}
