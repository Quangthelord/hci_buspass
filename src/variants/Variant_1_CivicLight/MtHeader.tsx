import { Menu, RefreshCw } from 'lucide-react'

export function MtHeader({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <header className="mt-sg-header flex shrink-0 items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <button type="button" className="rounded-lg p-1.5 opacity-90 hover:bg-white/10" aria-label="Menu">
          <Menu className="h-6 w-6" strokeWidth={2.25} />
        </button>
        <div>
          <p className="mt-sg-brand text-lg font-bold leading-tight">MyTransport.SG</p>
          <p className="text-xs font-medium text-white/80">Land Transport Authority</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onRefresh}
        className="rounded-full p-2 opacity-90 hover:bg-white/10"
        aria-label="Refresh arrivals"
      >
        <RefreshCw className="h-5 w-5" strokeWidth={2.25} />
      </button>
    </header>
  )
}
