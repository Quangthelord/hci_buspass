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
    <header className="bp-kiosk-header flex shrink-0 items-center gap-2 border-b border-[#e8e8e8] bg-white px-3 py-2.5">
      <div className="w-[4.5rem] shrink-0">
        {showBack && onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-0.5 text-sm font-semibold text-neon-green"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
            {isVi ? 'Quay lại' : 'Back'}
          </button>
        )}
      </div>

      <div className="min-w-0 flex-1 text-center">
        <p className="truncate text-base font-black uppercase leading-tight text-gray-900">
          {stationName}
        </p>
        {onViewModeChange && viewMode && (
          <div className="bp-view-toggle mx-auto mt-1.5 inline-flex rounded-lg border border-kiosk-border bg-kiosk-panel p-0.5">
            <button
              type="button"
              onClick={() => onViewModeChange('map')}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide transition ${
                viewMode === 'map'
                  ? 'bg-neon-green text-white'
                  : 'text-gray-600 hover:text-neon-green'
              }`}
            >
              <Map className="h-3 w-3" strokeWidth={2.5} />
              {isVi ? 'Bản đồ' : 'Map'}
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide transition ${
                viewMode === 'list'
                  ? 'bg-neon-green text-white'
                  : 'text-gray-600 hover:text-neon-green'
              }`}
            >
              <List className="h-3 w-3" strokeWidth={2.5} />
              {isVi ? 'Danh sách' : 'List'}
            </button>
          </div>
        )}
      </div>

      <time
        className="w-[4.5rem] shrink-0 text-right text-xl font-black tabular-nums text-gray-900"
        dateTime={now.toISOString()}
      >
        {formatTime24(now)}
      </time>
    </header>
  )
}
