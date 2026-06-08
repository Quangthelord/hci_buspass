import { useState } from 'react'
import type { BusRouteData } from '../../data/busRoutes'
import { STATUS_PILL } from './constants'
import { getEtaContext, type UncertaintyStatus } from './etaContext'

/** TransPerth-style "MORE INFO" link for journey interruptions. */
export function TpInterruptionLink({ route }: { route: BusRouteData }) {
  const [open, setOpen] = useState(false)
  const ctx = getEtaContext(route)
  const pill = STATUS_PILL[ctx.status as UncertaintyStatus]

  return (
    <span>
      <button
        type="button"
        className="tp-link-blue"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
      >
        MORE INFO
      </button>
      {open && (
        <span
          className="mt-1 block rounded px-2 py-1.5 text-left text-xs leading-relaxed"
          style={{ backgroundColor: pill.bg, color: pill.text }}
          onClick={(e) => e.stopPropagation()}
        >
          {ctx.incidentDetails}
        </span>
      )}
    </span>
  )
}

/** Standalone delay panel for arrival lists (legacy export kept for compatibility). */
export function DelayReason({
  context,
  onExpand,
}: {
  context: ReturnType<typeof getEtaContext>
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
          <p className="text-sm leading-snug text-[#555]">{context.reason}</p>
        )}
      </div>

      <button
        type="button"
        onClick={toggle}
        className="tp-link-blue mt-1 text-sm"
        aria-expanded={open}
      >
        MORE INFO
      </button>

      {open && (
        <p className="mt-2 rounded px-3 py-2 text-sm leading-relaxed text-[#333] bg-[#F5F5F5]">
          {context.incidentDetails}
        </p>
      )}
    </div>
  )
}
