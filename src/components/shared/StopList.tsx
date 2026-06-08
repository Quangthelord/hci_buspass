import type { BusStop } from '../../data/busRoutes'

export function StopList({
  stops,
  selectedStop,
  onSelect,
}: {
  stops: BusStop[]
  selectedStop?: string
  onSelect?: (stopId: string) => void
}) {
  return (
    <ul className="max-h-64 space-y-2 overflow-y-auto overscroll-contain">
      {stops.map((stop) => {
        const selected = selectedStop === stop.id
        return (
          <li key={stop.id}>
            <button
              type="button"
              onClick={() => onSelect?.(stop.id)}
              className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                selected
                  ? 'border-neon-green bg-neon-green/10 font-semibold text-neon-green'
                  : 'border-kiosk-border bg-white hover:border-neon-green/50'
              }`}
            >
              <p>{stop.name}</p>
              <p className="text-xs text-gray-500">
                ~{stop.nextArrival} phút · tiếp theo ~{stop.nextNextArrival} phút
              </p>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
