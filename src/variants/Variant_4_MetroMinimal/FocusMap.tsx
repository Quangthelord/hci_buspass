import type { BusRouteData } from '../../data/busRoutes'
import { METRO } from './constants'

/**
 * Focus-mode map: renders ONLY the selected route.
 * All other routes are hidden (filter applied upstream — nothing else is passed in).
 */
export function FocusMap({
  route,
  destination,
}: {
  route: BusRouteData
  destination: string
}) {
  const destIndex = route.stops.findIndex((s) =>
    s.name.toLowerCase().includes(destination.toLowerCase()),
  )
  const visibleStops = route.stops.slice(0, destIndex >= 0 ? destIndex + 1 : route.stops.length)

  const points = visibleStops.map((stop, i) => ({
    x: 36 + i * (320 / Math.max(visibleStops.length - 1, 1)),
    y: 70 + (i % 2 === 0 ? 0 : 28),
    name: stop.name,
    isEnd: i === visibleStops.length - 1,
  }))

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return (
    <svg
      viewBox="0 0 360 160"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      aria-label={`Bản đồ tuyến ${route.id}`}
      role="img"
    >
      <rect width="360" height="160" rx="8" fill={METRO.bg} />

      {/* Minimal grid — muted, no other routes */}
      {[40, 80, 120].map((y) => (
        <line
          key={`g-${y}`}
          x1="20"
          y1={y}
          x2="340"
          y2={y}
          stroke={METRO.mapGrid}
          strokeWidth="1"
        />
      ))}

      {/* Single highlighted route */}
      <path
        d={pathD}
        fill="none"
        stroke={METRO.primary}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {points.map((p, i) => (
        <g key={`${p.name}-${i}`}>
          <circle
            cx={p.x}
            cy={p.y}
            r={p.isEnd ? 8 : i === 0 ? 7 : 5}
            fill={p.isEnd ? METRO.primary : METRO.card}
            stroke={METRO.primary}
            strokeWidth="2"
          />
          {i === 0 || p.isEnd ? (
            <text
              x={p.x}
              y={p.y + 20}
              textAnchor="middle"
              fill={METRO.muted}
              fontSize="9"
              fontFamily="Inter, sans-serif"
              fontWeight="500"
            >
              {p.name.length > 16 ? `${p.name.slice(0, 14)}…` : p.name}
            </text>
          ) : null}
        </g>
      ))}
    </svg>
  )
}
