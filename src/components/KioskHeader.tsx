import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Accessibility, Bus, CloudSun } from 'lucide-react'
import { useKiosk, stationName } from '../context/KioskContext'
import { AlertsCompact } from './AlertsCompact'
import { tr } from '../i18n/translations'

export function KioskHeader({ showIdle = true }: { showIdle?: boolean }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { lang, idleSecondsLeft } = useKiosk()
  const [now, setNow] = useState(new Date())
  const showA11y = pathname !== '/accessibility'

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const timeStr = now.toLocaleTimeString(lang === 'vi' ? 'vi-VN' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <header className="relative z-30 flex shrink-0 flex-col border-b border-kiosk-border bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-kiosk-border bg-kiosk-panel sm:h-12 sm:w-12">
            <Bus className="h-6 w-6 text-neon-green sm:h-7 sm:w-7" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="text-base font-bold text-neon-green sm:text-lg">BusPass</p>
            <p className="truncate text-xs text-kiosk-muted sm:text-sm">{stationName(lang)}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {showA11y && (
            <button
              type="button"
              onClick={() => navigate('/accessibility')}
              className="btn-kiosk flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl border-2 border-neon-green bg-white px-2.5 text-neon-green transition hover:bg-kiosk-panel sm:h-11 sm:px-3"
              aria-label={tr('accessibilityBtn', lang)}
              title={tr('accessibilityBtn', lang)}
            >
              <Accessibility className="h-5 w-5" />
              <span className="hidden text-xs font-bold xl:inline">♿</span>
            </button>
          )}
          <AlertsCompact />
          <div className="hidden text-right sm:block">
            <p className="text-xl font-bold text-neon-green lg:text-2xl">{timeStr}</p>
            <p className="flex items-center justify-end gap-1 text-xs text-kiosk-muted">
              <CloudSun className="h-3.5 w-3.5 text-neon-green" />
              32°C · TP.HCM
            </p>
            {showIdle && idleSecondsLeft !== null && idleSecondsLeft <= 15 && (
              <p className="text-[10px] text-warning-orange">
                {tr('resetIn', lang)} {idleSecondsLeft}s
              </p>
            )}
          </div>
        </div>
      </div>
      {/* Mobile: time row */}
      <div className="flex items-center justify-end gap-2 border-t border-kiosk-border/50 px-4 py-1.5 sm:hidden">
        <CloudSun className="h-3.5 w-3.5 text-neon-green" />
        <span className="text-sm font-semibold text-neon-green">{timeStr}</span>
        <span className="text-xs text-kiosk-muted">32°C</span>
      </div>
    </header>
  )
}
