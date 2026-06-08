import { DARK } from './constants'

/** Abstract HCMC grid + cyan route overlay (Citymapper-style dark map). */
export function DarkMap({ routeColor = DARK.cyan }: { routeColor?: string }) {
  return (
    <svg
      viewBox="0 0 400 600"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <rect width="400" height="600" fill={DARK.bg} />

      {/* City grid — abstract road lines */}
      {[80, 140, 200, 260, 320, 380].map((y) => (
        <line key={`h-${y}`} x1="0" y1={y} x2="400" y2={y} stroke={DARK.grid} strokeWidth="1" opacity="0.6" />
      ))}
      {[50, 110, 170, 230, 290, 350].map((x) => (
        <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="600" stroke={DARK.grid} strokeWidth="1" opacity="0.5" />
      ))}

      {/* Diagonal arterials */}
      <line x1="0" y1="120" x2="400" y2="480" stroke={DARK.grid} strokeWidth="2" opacity="0.4" />
      <line x1="400" y1="80" x2="0" y2="520" stroke={DARK.grid} strokeWidth="2" opacity="0.35" />

      {/* Highlighted bus route — neon cyan */}
      <path
        d="M 60 480 Q 120 420 180 380 T 300 280 T 340 180"
        fill="none"
        stroke={routeColor}
        strokeWidth="5"
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 8px ${routeColor})` }}
      />

      {/* Station markers */}
      {[
        [60, 480],
        [180, 380],
        [260, 320],
        [340, 180],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="6" fill={DARK.card} stroke={DARK.muted} strokeWidth="2" />
          {i === 0 && <circle cx={cx} cy={cy} r="3" fill={DARK.cyan} />}
        </g>
      ))}

      {/* Moving bus position — pulsing dot */}
      <g className="dark-map-bus-pulse">
        <circle cx="220" cy="340" r="10" fill={routeColor} opacity="0.35" />
        <circle cx="220" cy="340" r="5" fill={routeColor} />
      </g>

      {/* Current station label */}
      <text x="60" y="505" fill={DARK.text} fontSize="11" fontFamily="Inter, sans-serif" opacity="0.8">
        Bến Thành
      </text>
    </svg>
  )
}
