import { useEffect, useState } from 'react'
import { ChevronLeft, List, Map } from 'lucide-react'
import { formatTime24 } from '../../lib/formatVi'
import type { BpLang } from './constants'

export function BpKioskHeader({
  lang,
  stationName,
  onBack,
  showBack = true,
  viewMode,
  onViewModeChange,
}: {
  lang: BpLang
  stationName: string
  onBack?: () => void
  showBack?: boolean
  viewMode?: 'map' | 'list'
  onViewModeChange?: (mode: 'map' | 'list') => void
}) {
  const isVi = lang === 'vi'
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <header className="bp-kiosk-header flex shrink-0 flex-col gap-1 border-b border-[#e8e8e8] bg-white px-3 py-2">
      <div className="flex items-center justify-between gap-2">
        {showBack && onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex shrink-0 items-center gap-0.5 whitespace-nowrap text-xs font-semibold text-neon-green"
          >
            <ChevronLeft className="h-4 w-4 shrink-0" strokeWidth={2.5} />
            {isVi ? 'Quay lại' : 'Back'}
          </button>
        ) : (
          <span className="w-16 shrink-0" aria-hidden />
        )}

        <p className="min-w-0 flex-1 truncate px-1 text-center text-sm font-bold uppercase tracking-wide text-gray-900">
          {stationName}
        </p>

        <time
          className="shrink-0 whitespace-nowrap text-base font-bold tabular-nums text-gray-900"
          dateTime={now.toISOString()}
        >
          {formatTime24(now)}
        </time>
      </div>

      {onViewModeChange && viewMode && (
        <div className="bp-view-toggle mx-auto inline-flex rounded-md border border-kiosk-border bg-kiosk-panel p-0.5">
          <button
            type="button"
            onClick={() => onViewModeChange('map')}
            className={`flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide transition ${
              viewMode === 'map'
                ? 'bg-neon-green text-white'
                : 'text-gray-600 hover:text-neon-green'
            }`}
          >
            <Map className="h-2.5 w-2.5" strokeWidth={2.5} />
            {isVi ? 'Bản đồ' : 'Map'}
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('list')}
            className={`flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide transition ${
              viewMode === 'list'
                ? 'bg-neon-green text-white'
                : 'text-gray-600 hover:text-neon-green'
            }`}
          >
            <List className="h-2.5 w-2.5" strokeWidth={2.5} />
            {isVi ? 'Danh sách' : 'List'}
          </button>
        </div>
      )}
    </header>
  )
}
