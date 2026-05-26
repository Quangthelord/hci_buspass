import { useEffect, useState } from 'react'

/** Khung máy ảo chỉ trên màn hình rộng (demo laptop); điện thoại thật = full width. */
export function useShowPhoneFrame() {
  const [show, setShow] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true,
  )

  useEffect(() => {
    const onResize = () => setShow(window.innerWidth >= 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return show
}
