export type UrgencyLevel = 'normal' | 'soon' | 'arriving'

const URGENCY_STYLES: Record<UrgencyLevel, string> = {
  normal: 'border-kiosk-border bg-white text-neon-green',
  soon: 'border-warning-orange bg-warning-orange/10 text-warning-orange',
  arriving: 'border-red-500 bg-red-50 text-red-600 animate-pulse',
}

export function BusArrivalTimer({
  minutes,
  seconds,
  urgencyLevel = 'normal',
}: {
  minutes: number
  seconds: number
  urgencyLevel?: UrgencyLevel
}) {
  const mm = String(minutes).padStart(2, '0')
  const ss = String(seconds).padStart(2, '0')

  return (
    <div
      className={`inline-flex flex-col items-center rounded-xl border-2 px-6 py-4 ${URGENCY_STYLES[urgencyLevel]}`}
      role="timer"
      aria-live="polite"
    >
      <span className="text-4xl font-bold tabular-nums">
        {mm}:{ss}
      </span>
      <span className="mt-1 text-xs font-medium uppercase tracking-wide opacity-80">
        {urgencyLevel === 'arriving' ? 'Sắp đến' : urgencyLevel === 'soon' ? 'Gần đến' : 'Còn lại'}
      </span>
    </div>
  )
}
