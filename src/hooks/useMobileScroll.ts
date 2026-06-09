import { useEffect } from 'react'

const SCROLL_CLASS = 'mobile-scroll'

/** Bật cuộn trang trên điện thoại (body mặc định overflow:hidden cho kiosk). */
export function useMobileScroll() {
  useEffect(() => {
    const targets = [
      document.documentElement,
      document.body,
      document.getElementById('root'),
      document.querySelector('.kiosk-variant-root'),
    ]

    for (const el of targets) {
      el?.classList.add(SCROLL_CLASS)
    }

    return () => {
      for (const el of targets) {
        el?.classList.remove(SCROLL_CLASS)
      }
    }
  }, [])
}
