import { MapPin } from 'lucide-react'
import { BUS_STOP_CODE } from './constants'

export function MtBusStopHeader({ stopName }: { stopName: string }) {
  return (
    <div className="flex shrink-0 items-start gap-3 bg-white px-4 py-3">
      <span className="mt-sg-stop-badge">{BUS_STOP_CODE}</span>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[#757575]">
          <MapPin className="h-3.5 w-3.5" />
          Near You
        </p>
        <h1 className="text-lg font-bold leading-snug text-[#212121]">{stopName}</h1>
        <p className="text-sm text-[#757575]">Bus services at this stop</p>
      </div>
    </div>
  )
}
