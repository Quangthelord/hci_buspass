import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, Bell, ChevronDown, CloudRain, X } from 'lucide-react'
import { LIVE_ALERTS, type AlertSeverity, type KioskAlert } from '../data/alerts'
import { useKiosk } from '../context/KioskContext'

const SEVERITY_DOT: Record<AlertSeverity, string> = {
  info: 'bg-green-500',
  warning: 'bg-amber-500',
  critical: 'bg-red-500',
}

export function AlertsCompact() {
  const { lang } = useKiosk()
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [tick, setTick] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)

  const visible = LIVE_ALERTS.filter((a) => !dismissed.has(a.id))

  useEffect(() => {
    if (visible.length <= 1) return
    const t = setInterval(() => setTick((n) => n + 1), 5000)
    return () => clearInterval(t)
  }, [visible.length])

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  if (visible.length === 0) return null

  const preview = visible[tick % visible.length]

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex max-w-[200px] items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition sm:max-w-xs sm:px-3 sm:py-1.5 sm:text-sm ${
          open
            ? 'border-amber-400 bg-amber-50 text-amber-900'
            : 'border-amber-200 bg-amber-50/80 text-amber-800 hover:border-amber-300'
        }`}
        aria-expanded={open}
        aria-label={lang === 'vi' ? `${visible.length} cảnh báo` : `${visible.length} alerts`}
      >
        <Bell className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
        <span className="hidden truncate sm:inline">{preview.title[lang]}:</span>
        <span className="truncate opacity-90">{preview.message[lang]}</span>
        <span className="shrink-0 rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white sm:text-xs">
          {visible.length}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,22rem)] rounded-xl border border-kiosk-border bg-white py-2 shadow-xl">
          <div className="flex items-center justify-between border-b border-kiosk-border px-3 pb-2">
            <p className="text-xs font-bold text-gray-700">
              {lang === 'vi' ? 'Cảnh báo thời gian thực' : 'Live alerts'}
            </p>
            <button
              type="button"
              onClick={() => {
                setDismissed(new Set(LIVE_ALERTS.map((a) => a.id)))
                setOpen(false)
              }}
              className="text-xs text-gray-500 hover:text-neon-green"
            >
              {lang === 'vi' ? 'Ẩn hết' : 'Dismiss all'}
            </button>
          </div>
          <ul className="max-h-48 overflow-y-auto">
            {visible.map((alert) => (
              <AlertRow
                key={alert.id}
                alert={alert}
                lang={lang}
                onDismiss={() => setDismissed((s) => new Set(s).add(alert.id))}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function AlertRow({
  alert,
  lang,
  onDismiss,
}: {
  alert: KioskAlert
  lang: import('../data/mockData').Lang
  onDismiss: () => void
}) {
  const Icon = alert.severity === 'info' ? CloudRain : AlertTriangle
  return (
    <li className="flex gap-2 border-b border-gray-100 px-3 py-2 last:border-0">
      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-gray-800">{alert.title[lang]}</p>
        <p className="text-xs leading-snug text-gray-600">{alert.message[lang]}</p>
      </div>
      <button type="button" onClick={onDismiss} className="shrink-0 p-1 text-gray-400 hover:text-gray-700" aria-label="Dismiss">
        <X className="h-3.5 w-3.5" />
      </button>
    </li>
  )
}
