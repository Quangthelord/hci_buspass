import { Flag, MapPin } from 'lucide-react'

type Stop = { id: string; name: string }

export function RouteStopTimeline({
  stops,
  stationName,
  lang,
}: {
  stops: Stop[]
  stationName: string
  lang: 'vi' | 'en'
}) {
  const isVi = lang === 'vi'
  const currentIdx = Math.max(
    0,
    stops.findIndex((s) => s.name === stationName),
  )
  const lastIdx = stops.length - 1

  return (
    <ol className="bp-route-timeline" aria-label={isVi ? 'Các trạm dừng' : 'All stops'}>
      {stops.map((stop, i) => {
        const isCurrent = i === currentIdx
        const isDest = i === lastIdx
        const isPast = i < currentIdx

        return (
          <li
            key={stop.id}
            className={`bp-route-timeline__item ${isCurrent ? 'bp-route-timeline__item--current' : ''} ${isDest ? 'bp-route-timeline__item--dest' : ''} ${isPast ? 'bp-route-timeline__item--past' : ''}`}
          >
            <div className="bp-route-timeline__track" aria-hidden>
              {i < lastIdx && <span className="bp-route-timeline__line" />}
              <span className="bp-route-timeline__node">
                {isCurrent ? (
                  <MapPin className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                ) : isDest ? (
                  <Flag className="h-3 w-3 text-neon-green" strokeWidth={2.5} />
                ) : (
                  <span className="bp-route-timeline__dot" />
                )}
              </span>
            </div>
            <div className="bp-route-timeline__body min-w-0 flex-1 pb-4">
              <p className="text-sm font-bold leading-snug text-gray-900">
                <span className="tabular-nums text-gray-600">{String(i + 1).padStart(2, '0')}.</span>{' '}
                {stop.name}
              </p>
              {isCurrent && (
                <span className="mt-1 inline-block rounded-md bg-neon-green px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  {isVi ? 'Bạn ở đây' : 'You are here'}
                </span>
              )}
              {isDest && !isCurrent && (
                <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-neon-green">
                  <Flag className="h-3 w-3" strokeWidth={2.5} />
                  {isVi ? 'Trạm cuối' : 'Final stop'}
                </span>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
