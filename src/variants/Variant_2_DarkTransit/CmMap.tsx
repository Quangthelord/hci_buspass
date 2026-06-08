import { Bus, MapPin } from 'lucide-react'

export function CmMap({
  variant = 'home',
  busProgress = 0.35,
  showEnd = true,
}: {
  variant?: 'home' | 'route' | 'go'
  busProgress?: number
  showEnd?: boolean
}) {
  const routeColor = variant === 'go' ? '#FF8C00' : '#37B24D'
  const busLeft = `${15 + busProgress * 65}%`
  const busTop = variant === 'go' ? '48%' : '42%'

  return (
    <div className="cm-map relative h-full w-full">
      {/* Parks */}
      <div className="absolute rounded-lg bg-[#D4EDDA]/60" style={{ top: '8%', left: '5%', width: '35%', height: '25%' }} />
      <div className="absolute rounded-lg bg-[#D4EDDA]/50" style={{ top: '55%', right: '8%', width: '28%', height: '20%' }} />

      {/* Roads */}
      {[20, 38, 55, 72].map((t) => (
        <div key={`h-${t}`} className="cm-map-road-h" style={{ top: `${t}%`, left: '0', width: '100%', height: '3%' }} />
      ))}
      {[18, 38, 58, 78].map((l) => (
        <div key={`v-${l}`} className="cm-map-road-v" style={{ left: `${l}%`, top: '5%', width: '2.5%', height: '90%' }} />
      ))}

      {/* Route line */}
      <div
        className="cm-map-route"
        style={{
          top: '44%',
          left: '12%',
          width: '72%',
          transform: 'rotate(-12deg)',
          background: routeColor,
        }}
      />

      {/* User location fan (home) */}
      {variant === 'home' && (
        <div className="absolute" style={{ top: '46%', left: '44%' }}>
          <div className="h-8 w-8 rounded-full bg-[#37B24D]/25" />
          <div className="cm-map-user absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      )}

      {/* Bus stop pins */}
      {variant !== 'go' && (
        <>
          <div
            className="absolute flex h-7 w-7 items-center justify-center rounded-full bg-[#2D3A4F] text-white shadow-md"
            style={{ top: '38%', left: '20%' }}
          >
            <Bus className="h-3.5 w-3.5" />
          </div>
          <div
            className="absolute flex h-7 w-7 items-center justify-center rounded-full bg-[#2D3A4F] text-white shadow-md"
            style={{ top: '32%', left: '68%' }}
          >
            <span className="text-[0.5rem] font-bold">01</span>
          </div>
        </>
      )}

      {/* Moving bus */}
      <div
        className="absolute flex h-8 w-8 items-center justify-center rounded-full border-2 border-white shadow-lg"
        style={{ top: busTop, left: busLeft, background: routeColor }}
      >
        <Bus className="h-4 w-4 text-white" />
      </div>

      {/* End marker */}
      {showEnd && (
        <div className="absolute flex items-center gap-1" style={{ top: '28%', right: '14%' }}>
          <MapPin className="h-4 w-4 text-[#37B24D]" fill="#37B24D" />
          <span className="cm-map-end">End</span>
        </div>
      )}

      {variant === 'route' && (
        <div className="cm-eta-bubble absolute" style={{ top: '30%', left: '50%' }}>
          <span className="cm-live-signal mr-1">📡</span>
          <span className="font-bold text-[#1A1A1A]">in 6, 12 min</span>
        </div>
      )}
    </div>
  )
}
