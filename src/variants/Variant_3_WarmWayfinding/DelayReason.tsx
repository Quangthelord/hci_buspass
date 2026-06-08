import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { STATUS_PILL, WARM } from './constants'
import type { EtaContext, UncertaintyStatus } from './etaContext'

export function DelayReason({
  context,
  onExpand,
}: {
  context: EtaContext
  onExpand?: () => void
}) {
  const [open, setOpen] = useState(false)
  const pill = STATUS_PILL[context.status as UncertaintyStatus]

  const toggle = () => {
    const next = !open
    setOpen(next)
    if (next) onExpand?.()
  }

  return (
    <div className="mt-2">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="rounded-full px-2.5 py-0.5 text-sm font-medium"
          style={{ backgroundColor: pill.bg, color: pill.text }}
        >
          {pill.label}
        </span>
        {context.reason && (
          <p className="text-base leading-snug" style={{ color: WARM.secondary }}>
            {context.reason}
          </p>
        )}
        {!context.reason && context.status === 'on_time' && (
          <p className="text-base leading-snug" style={{ color: WARM.muted }}>
            Không có sự cố trên tuyến
          </p>
        )}
        {!context.reason && context.status === 'unknown' && (
          <p className="text-base leading-snug" style={{ color: WARM.muted }}>
            Tín hiệu GPS tạm thời không ổn định
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={toggle}
        className="mt-2 flex items-center gap-1 text-base font-medium"
        style={{ color: WARM.primary }}
        aria-expanded={open}
      >
        Xem thêm
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open && (
        <p
          className="mt-2 rounded-lg px-3 py-2.5 text-base leading-relaxed"
          style={{ backgroundColor: WARM.bg, color: WARM.text }}
        >
          {context.incidentDetails}
        </p>
      )}
    </div>
  )
}
