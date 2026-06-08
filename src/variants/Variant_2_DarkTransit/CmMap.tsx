const SUBWAY_PINS = [
  { x: 28, y: 32, letters: 'B1', color: '#3CB44A' },
  { x: 52, y: 24, letters: '01', color: '#3CB44A' },
  { x: 72, y: 38, letters: 'B2', color: '#F5C518' },
  { x: 38, y: 58, letters: '08', color: '#7B4397' },
]

export function CmMap({
  variant = 'home',
  busProgress = 0.35,
}: {
  variant?: 'home' | 'route' | 'go'
  busProgress?: number
}) {
  const routeStroke = variant === 'go' ? '#FF8C00' : '#3CB44A'
  const routeDash = variant === 'go' ? '6 8' : 'none'
  const busX = 55 + busProgress * 180
  const busY = variant === 'go' ? 195 : 175

  return (
    <svg viewBox="0 0 360 320" className="cm-map-svg h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="360" height="320" fill="#EEF1F4" />

      {/* Parks */}
      <rect x="12" y="20" width="110" height="70" rx="8" fill="#C8E6C9" opacity="0.55" />
      <rect x="230" y="200" width="90" height="55" rx="8" fill="#C8E6C9" opacity="0.45" />

      {/* Roads */}
      {[60, 110, 160, 210, 260].map((y) => (
        <rect key={`h${y}`} x="0" y={y} width="360" height="14" fill="#FFFFFF" opacity="0.9" />
      ))}
      {[45, 105, 165, 225, 285].map((x) => (
        <rect key={`v${x}`} x={x} y="10" width="10" height="300" fill="#FFFFFF" opacity="0.85" />
      ))}

      {/* Diagonal arterial */}
      <line x1="20" y1="280" x2="340" y2="80" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />

      {/* Route path */}
      <path
        d="M 48 250 Q 100 200 150 180 T 260 120 T 310 90"
        fill="none"
        stroke={routeStroke}
        strokeWidth={variant === 'go' ? 7 : 5}
        strokeLinecap="round"
        strokeDasharray={routeDash}
        opacity={0.95}
      />

      {/* Home: dashed nearby radius */}
      {variant === 'home' && (
        <circle cx="180" cy="165" r="72" fill="none" stroke="#3CB44A" strokeWidth="2" strokeDasharray="6 6" opacity="0.35" />
      )}

      {/* User location cone */}
      {variant === 'home' && (
        <g transform="translate(180,165)">
          <path d="M0,-28 L-18,8 A20,20 0 0,1 18,8 Z" fill="#3CB44A" opacity="0.2" />
          <circle r="7" fill="#2A81F6" stroke="#fff" strokeWidth="3" />
        </g>
      )}

      {/* Transit stop pins */}
      {variant !== 'go' &&
        SUBWAY_PINS.map((pin) => (
          <g key={pin.letters} transform={`translate(${pin.x * 3.6},${pin.y * 3.2})`}>
            <circle r="14" fill="#2E3A4D" />
            <text y="4" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700">
              {pin.letters}
            </text>
          </g>
        ))}

      {/* Live bus */}
      <g transform={`translate(${busX},${busY})`}>
        {variant === 'go' && <circle r="18" fill="#FF8C00" opacity="0.25" className="cm-map-pulse" />}
        <circle r="12" fill={routeStroke} stroke="#fff" strokeWidth="2.5" />
        <text y="4" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">
          🚌
        </text>
      </g>

      {/* Start / End labels */}
      {variant !== 'home' && (
        <>
          <g transform="translate(48,250)">
            <rect x="-18" y="-10" width="36" height="18" rx="4" fill="#3CB44A" />
            <text y="4" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700">
              Start
            </text>
          </g>
          <g transform="translate(310,90)">
            <rect x="-14" y="-10" width="28" height="18" rx="4" fill="#3CB44A" />
            <text y="4" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700">
              End
            </text>
          </g>
        </>
      )}

      {/* GO mode user dot */}
      {variant === 'go' && (
        <circle cx={busX - 40} cy={busY + 5} r="6" fill="#2A81F6" stroke="#fff" strokeWidth="2" />
      )}

      {/* Street label */}
      <text x="200" y="125" fill="#9CA3AF" fontSize="9" fontWeight="600">
        Phan Chu Trinh
      </text>
    </svg>
  )
}

export function CmMapOverlayEta({ minutes }: { minutes: number | number[] }) {
  const label = Array.isArray(minutes) ? `in ${minutes.join(', ')} min` : `in ${minutes} min`
  return (
    <div className="cm-map-eta-overlay">
      <CmLiveSignal className="mr-1" />
      {label}
    </div>
  )
}

function CmLiveSignal({ className = '' }: { className?: string }) {
  return <span className={`cm-live-signal inline-flex ${className}`}>📡</span>
}
