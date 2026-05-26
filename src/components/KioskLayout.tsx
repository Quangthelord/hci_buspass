import { useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useKiosk } from '../context/KioskContext'
import { KioskHeader } from './KioskHeader'

export function KioskLayout({
  children,
  showHeader = true,
  className = '',
  scrollable = true,
}: {
  children: ReactNode
  showHeader?: boolean
  className?: string
  /** Tắt khi trang cần layout cố định (bản đồ, chi tiết 2 cột) */
  scrollable?: boolean
}) {
  const { touchActivity } = useKiosk()
  const navigate = useNavigate()

  useEffect(() => {
    const onActivity = () => touchActivity()
    window.addEventListener('pointerdown', onActivity)
    window.addEventListener('keydown', onActivity)
    return () => {
      window.removeEventListener('pointerdown', onActivity)
      window.removeEventListener('keydown', onActivity)
    }
  }, [touchActivity])

  // Triple-finger tap gesture (simulated: key "a" + triple click area - use 3 touches count)
  useEffect(() => {
    let touches = 0
    let timer: ReturnType<typeof setTimeout>
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length === 3) {
        touches++
        clearTimeout(timer)
        timer = setTimeout(() => {
          if (touches >= 2) navigate('/accessibility')
          touches = 0
        }, 800)
      }
    }
    window.addEventListener('touchstart', onTouch)
    return () => window.removeEventListener('touchstart', onTouch)
  }, [navigate])

  return (
    <div className={`kiosk-root flex h-full flex-col ${className}`} onPointerDown={touchActivity}>
      {showHeader && <KioskHeader />}
      <main
        className={`kiosk-main page-transition min-h-0 flex-1 ${scrollable ? 'kiosk-main--scroll' : 'flex flex-col overflow-hidden'}`}
      >
        {children}
      </main>
    </div>
  )
}
