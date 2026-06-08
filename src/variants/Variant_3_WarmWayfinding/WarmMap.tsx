import type { BusRouteData } from '../../data/busRoutes'
import { WARM } from './constants'

/** Clean line map — warm beige, amber route, orange stop circles. */
export function WarmMap({ route }: { route: BusRouteData }) {
  const stops = route.stops.slice(0, 5)
  const points = stops.map((_, i) => {
    const x = 40 + i * 70
    const y = 80 + (i % 2) * 30
    return { x, y, name: stops[i].name }
  })

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return (
    <svg
      viewBox="0 0 360 200"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      aria-label={`Bản đồ tuyến ${route.id}`}
      role="img"
    >
      <rect width="360" height="200" rx="12" fill={WARM.mapBg} />

      {/* Background grid — subtle warm lines */}
      {[50, 100, 150].map((y) => (
        <line
          key={`h-${y}`}
          x1="16"
          y1={y}
          x2="344"
          y2={y}
          stroke={WARM.mapLine}
          strokeWidth="1"
          opacity="0.7"
        />
      ))}
      {[90, 180, 270].map((x) => (
        <line
          key={`v-${x}`}
          x1={x}
          y1="16"
          x2={x}
          y2="184"
          stroke={WARM.mapLine}
          strokeWidth="1"
          opacity="0.5"
        />
      ))}

      {/* Route line — amber */}
      <path
        d={pathD}
        fill="none"
        stroke={WARM.primary}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Stop circles — filled orange */}
      {points.map((p, i) => (
        <g key={p.name}>
          <circle
            cx={p.x}
            cy={p.y}
            r={i === 0 ? 9 : 7}
            fill={WARM.primary}
            stroke={i === 0 ? WARM.secondary : '#FFFBF5'}
            strokeWidth={i === 0 ? 2 : 1.5}
          />
          <text
            x={p.x}
            y={p.y + 22}
            textAnchor="middle"
            fill={WARM.secondary}
            fontSize="10"
            fontFamily="Inter, sans-serif"
          >
            {p.name.length > 14 ? `${p.name.slice(0, 12)}…` : p.name}
          </text>
        </g>
      ))}

      {/* Current position marker */}
      {points.length > 1 && (
        <circle
          cx={(points[0].x + points[1].x) / 2}
          cy={(points[0].y + points[1].y) / 2}
          r="5"
          fill={WARM.secondary}
          opacity="0.85"
        />
      )}
    </svg>
  )
}
