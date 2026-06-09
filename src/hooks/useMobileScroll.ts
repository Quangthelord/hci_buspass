import { useEffect } from 'react'

const SCROLL_CLASS = 'mobile-scroll'

/** Bật cuộn trang trên điện thoại (body mặc định overflow:hidden cho kiosk). */
export function useMobileScroll() {
  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    const root = document.getElementById('root')
    const variantRoot = document.querySelector('.kiosk-variant-root')

    html.classList.add(SCROLL_CLASS)
    body.classList.add(SCROLL_CLASS)
    root?.classList.add(SCROLL_CLASS)
    variantRoot?.classList.add(SCROLL_CLASS)

    return () => {
      html.classList.remove(SCROLL_CLASS)
      body.classList.remove(SCROLL_CLASS)
      root?.classList.remove(SCROLL_CLASS)
      variantRoot?.classList.remove(SCROLL_CLASS)
    }
  }, [])
}
