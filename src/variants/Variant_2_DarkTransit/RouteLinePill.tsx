import type { BusStop } from '../../data/busRoutes'
import { DARK } from './constants'

export function RouteLinePill({
  stops,
  activeColor = DARK.cyan,
}: {
  stops: BusStop[]
  activeColor?: string
}) {
  const n = stops.length
  const width = Math.min(n * 48, 320)

  return (
    <div className="relative overflow-hidden rounded-full px-2 py-3" style={{ backgroundColor: DARK.card }}>
      <div
        className="relative mx-auto"
        style={{ width: `${width}px`, maxWidth: '100%' }}
      >
        {/* Route line */}
        <div
          className="absolute left-4 right-4 top-1/2 h-0.5 -translate-y-1/2 rounded-full"
          style={{
            backgroundColor: activeColor,
            boxShadow: `0 0 8px ${activeColor}`,
          }}
        />

        {/* Stop dots */}
        <div className="relative flex justify-between">
          {stops.slice(0, 6).map((stop, i) => (
            <div key={stop.id} className="flex flex-col items-center" title={stop.name}>
              <div
                className="z-10 h-2.5 w-2.5 rounded-full border-2"
                style={{
                  backgroundColor: i === 0 ? activeColor : DARK.bg,
                  borderColor: activeColor,
                }}
              />
            </div>
          ))}
        </div>

        {/* Moving vehicle icon */}
        <div
          className="dark-route-vehicle absolute top-1/2 z-20 -translate-y-1/2"
          style={{ left: '12%' }}
        >
          <span
            className="flex h-5 w-5 items-center justify-center rounded-full text-[10px]"
            style={{ backgroundColor: DARK.purple, color: '#fff' }}
          >
            🚌
          </span>
        </div>
      </div>
    </div>
  )
}
