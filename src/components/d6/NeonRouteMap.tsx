import type { BusRouteData } from '../../data/busRoutes'
import type { UrgencyLevel } from '../../lib/useUrgencyPulse'

const ROUTE_PATH = 'M 40 200 Q 100 160 160 140 T 280 100 T 340 70'

export function NeonRouteMap({
  route,
  urgencyLevel = 0,
  simplified = false,
}: {
  route: BusRouteData
  urgencyLevel?: UrgencyLevel
  simplified?: boolean
}) {
  const stops = simplified ? route.stops.slice(0, 3) : route.stops.slice(0, 5)
  const stopPoints = stops.map((_, i) => {
    const t = i / Math.max(stops.length - 1, 1)
    const x = 40 + t * 300
    const y = 200 - t * 130 + (i % 2) * (simplified ? 0 : 12)
    return { x, y, name: stops[i].name }
  })

  const routeClass = [
    'neon-route-line',
    urgencyLevel >= 2 ? 'neon-route-line--bright' : '',
    urgencyLevel >= 3 ? 'neon-route-line--flash' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const busClass = [
    'neon-bus-marker',
    urgencyLevel === 1 ? 'neon-bus-marker--pulse-slow' : '',
    urgencyLevel === 2 ? 'neon-bus-marker--pulse-fast' : '',
    urgencyLevel >= 3 ? 'neon-bus-marker--alert' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <svg
      viewBox="0 0 380 240"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      aria-label={`Bản đồ tuyến ${route.id}`}
      role="img"
    >
      <rect width="380" height="240" className="neon-map-bg" rx="12" />

      {!simplified &&
        [60, 120, 180].map((y) => (
          <line
            key={`h-${y}`}
            x1="16"
            y1={y}
            x2="364"
            y2={y}
            className="neon-road-line"
            strokeWidth="1"
          />
        ))}

      {!simplified &&
        [100, 200, 300].map((x) => (
          <line
            key={`v-${x}`}
            x1={x}
            y1="16"
            x2={x}
            y2="224"
            className="neon-road-line"
            strokeWidth="1"
          />
        ))}

      <path
        d={ROUTE_PATH}
        fill="none"
        className={routeClass}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {stopPoints.map((p, i) => (
        <g key={`${p.name}-${i}`}>
          <circle
            cx={p.x}
            cy={p.y}
            r={i === 0 ? 8 : 6}
            className="neon-stop-marker"
          />
          {!simplified && (i === 0 || i === stopPoints.length - 1) && (
            <text
              x={p.x}
              y={p.y + 20}
              textAnchor="middle"
              className="neon-stop-label"
              fontSize="10"
              fontFamily="Inter, sans-serif"
              fontWeight="600"
            >
              {p.name.length > 14 ? `${p.name.slice(0, 12)}…` : p.name}
            </text>
          )}
        </g>
      ))}

      <g className={busClass}>
        <circle cx="0" cy="0" r="12" className="neon-bus-dot" />
      </g>
    </svg>
  )
}
