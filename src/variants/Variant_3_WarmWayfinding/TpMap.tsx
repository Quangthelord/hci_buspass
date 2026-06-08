import { TP } from './constants'

export function TpMap({
  variant = 'near',
  routeId,
  busProgress = 0.4,
}: {
  variant?: 'near' | 'journey' | 'live'
  routeId?: string
  busProgress?: number
}) {
  const showRoute = variant === 'journey' || variant === 'live'

  return (
    <svg
      className="tp-map-svg"
      viewBox="0 0 360 240"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <rect width="360" height="240" fill={TP.mapBg} />

      {/* Buildings blocks */}
      {[
        [30, 40, 50, 35],
        [100, 60, 40, 30],
        [200, 30, 55, 40],
        [280, 70, 45, 35],
        [150, 150, 60, 45],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill="#E8E4DC" rx="2" />
      ))}

      {/* Roads */}
      <path d="M0 120 L360 120" stroke={TP.mapRoad} strokeWidth="12" />
      <path d="M120 0 L120 240" stroke={TP.mapRoad} strokeWidth="8" />
      <path d="M240 0 L240 240" stroke={TP.mapRoad} strokeWidth="6" />

      {showRoute && (
        <path
          d="M40 120 Q120 90 200 115 T320 100"
          fill="none"
          stroke={TP.mapRoute}
          strokeWidth="5"
          strokeLinecap="round"
        />
      )}

      {/* Bus stops */}
      {[
        { x: 80, y: 118, type: 'bus' },
        { x: 180, y: 112, type: 'bus' },
        { x: 280, y: 105, type: 'bus' },
        { x: 160, y: 80, type: 'train' },
      ].map((s, i) => (
        <g key={i} transform={`translate(${s.x}, ${s.y})`}>
          <path
            d="M0 -12 C-8 -12 -10 -4 -10 0 C-10 8 0 14 0 14 C0 14 10 8 10 0 C10 -4 8 -12 0 -12Z"
            fill={s.type === 'train' ? TP.pinGreen : TP.pinGrey}
          />
          <text y="3" textAnchor="middle" fill="#fff" fontSize="7">
            {s.type === 'train' ? '🚆' : '🚌'}
          </text>
        </g>
      ))}

      {/* User / bus */}
      {variant === 'near' && <circle cx="175" cy="125" r="5" fill={TP.pinRed} />}

      {variant === 'journey' && (
        <>
          <circle cx="50" cy="118" r="7" fill={TP.pinRed} stroke="#fff" strokeWidth="2" />
          <circle cx="310" cy="102" r="7" fill={TP.pinGreen} stroke="#fff" strokeWidth="2" />
        </>
      )}

      {variant === 'live' && routeId && (
        <g transform={`translate(${40 + busProgress * 240}, ${115 - busProgress * 20})`}>
          <circle r="14" fill={TP.pinGreen} stroke="#fff" strokeWidth="2.5" />
          <text y="4" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700">
            🚌
          </text>
        </g>
      )}
    </svg>
  )
}
