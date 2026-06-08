import { MV } from './constants'

const BUS_STOPS = [
  { x: 80, y: 95, label: 'B1' },
  { x: 160, y: 70, label: '01' },
  { x: 240, y: 110, label: 'B2' },
  { x: 300, y: 85, label: 'B3' },
]

export function MvMap({
  variant = 'nearby',
  routeColor = MV.busLineGreen,
}: {
  variant?: 'nearby' | 'detail'
  routeColor?: string
}) {
  const showRoute = variant === 'detail'

  return (
    <svg
      className="mv-map-svg"
      viewBox="0 0 360 200"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <rect width="360" height="200" fill={MV.mapBg} />

      {/* Parks */}
      <ellipse cx="60" cy="50" rx="35" ry="22" fill={MV.mapPark} opacity="0.7" />
      <ellipse cx="300" cy="150" rx="40" ry="25" fill={MV.mapPark} opacity="0.6" />

      {/* Roads */}
      <path d="M0 100 Q90 80 180 100 T360 95" fill="none" stroke={MV.mapRoad} strokeWidth="14" />
      <path d="M40 0 L40 200" fill="none" stroke={MV.mapRoad} strokeWidth="10" />
      <path d="M200 0 L200 200" fill="none" stroke={MV.mapRoad} strokeWidth="8" />
      <path d="M280 0 L280 200" fill="none" stroke={MV.mapRoad} strokeWidth="6" />

      {showRoute && (
        <path
          d="M50 100 Q120 75 180 100 T310 88"
          fill="none"
          stroke={routeColor}
          strokeWidth="5"
          strokeLinecap="round"
        />
      )}

      {/* Bus stop markers */}
      {BUS_STOPS.map((s) => (
        <g key={s.label} transform={`translate(${s.x}, ${s.y})`}>
          <rect x="-8" y="-8" width="16" height="16" rx="2" fill={MV.busGreen} />
          <text y="3" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700">
            🚌
          </text>
        </g>
      ))}

      {/* User location */}
      <g transform="translate(175, 125)">
        <circle r="6" fill="#2196F3" stroke="#fff" strokeWidth="2" />
        <path d="M0 -14 L-8 8 L8 8 Z" fill="#2196F3" opacity="0.25" transform="rotate(30)" />
      </g>

      {/* Red dot (nearby) */}
      {variant === 'nearby' && <circle cx="178" cy="128" r="4" fill={MV.pinRed} />}
    </svg>
  )
}
