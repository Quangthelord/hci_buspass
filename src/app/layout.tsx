import { useEffect, type ReactNode } from 'react'
import { KioskWrapper } from '../components/KioskWrapper'
import { resetKioskBodyTheme } from '../lib/kioskTheme'

export function KioskLayout({ children }: { children?: ReactNode }) {
  const skipMenu = Boolean(children)

  useEffect(() => {
    document.body.classList.add('kiosk-mode')
    resetKioskBodyTheme()
    return () => {
      document.body.classList.remove('kiosk-mode')
      resetKioskBodyTheme()
    }
  }, [])

  return <KioskWrapper skipMenu={skipMenu} directChild={children} />
}

export default KioskLayout
