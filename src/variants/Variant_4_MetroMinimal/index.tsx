import { useEffect, useMemo, useRef, useState } from 'react'
import { Bus, Footprints, MapPin, Search, CircleDot } from 'lucide-react'
import { busRoutesData } from '../../data/busRoutes'
import {
  completeTask,
  logClick,
  logStepComplete,
  startTask,
} from '../../lib/telemetry'
import { useMobileScroll } from '../../hooks/useMobileScroll'
import { RouteTag } from '../../components/shared/RouteTag'
import { FocusMap } from './FocusMap'
import { StepIndicator } from './StepIndicator'
import { FLOW_STEPS, METRO, VARIANT_ID } from './constants'
import { filterLocations } from './locations'
import {
  buildJourneySteps,
  getRouteOptions,
  type JourneyStep,
  type RouteOption,
} from './routeOptions'
import { TASK_DESTINATION } from '../../lib/taskGoal'

export interface Variant4Props {
  stationId?: string
  userId?: string
}

const JOURNEY_ICONS = {
  walk: Footprints,
  bus: Bus,
  ride: CircleDot,
  arrive: MapPin,
} as const

export default function Variant4MetroMinimal({
  stationId = 'ben-thanh',
  userId = 'participant-01',
}: Variant4Props) {
  useMobileScroll()

  const [flowStep, setFlowStep] = useState(1)
  const [query, setQuery] = useState('')
  const [destination, setDestination] = useState<string | null>(null)
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>([])
  const [selectedOption, setSelectedOption] = useState<RouteOption | null>(null)
  const [journeyActiveIndex, setJourneyActiveIndex] = useState(0)
  const taskStarted = useRef(false)
  const taskCompleted = useRef(false)
  const stepEnteredAt = useRef(Date.now())

  const stationName =
    busRoutesData.station.id === stationId
      ? busRoutesData.station.name
      : busRoutesData.station.name

  const suggestions = useMemo(() => filterLocations(query), [query])

  const journeySteps = useMemo<JourneyStep[]>(() => {
    if (!selectedOption || !destination) return []
    return buildJourneySteps(selectedOption, destination, stationName)
  }, [selectedOption, destination, stationName])

  const ensureTaskStart = () => {
    if (!taskStarted.current) {
      taskStarted.current = true
      startTask(VARIANT_ID, userId)
      stepEnteredAt.current = Date.now()
    }
  }

  const trackClick = (target: string, isHit = true) => {
    logClick(VARIANT_ID, target, isHit)
  }

  const advanceFlow = (nextStep: number, stepName: string) => {
    const durationMs = Date.now() - stepEnteredAt.current
    logStepComplete(VARIANT_ID, flowStep, stepName, durationMs)
    stepEnteredAt.current = Date.now()
    setFlowStep(nextStep)
  }

  const selectDestination = (loc: string) => {
    ensureTaskStart()
    trackClick(`destination-${loc}`, true)
    setDestination(loc)
    setQuery(loc)
    const options = getRouteOptions(loc)
    setRouteOptions(options)
    setSelectedOption(options.find((o) => o.isRecommended) ?? options[0] ?? null)
    advanceFlow(2, FLOW_STEPS[0].name)
  }

  const confirmRoute = () => {
    if (!selectedOption) return
    ensureTaskStart()
    trackClick(`route-confirm-${selectedOption.route.id}`, true)
    setJourneyActiveIndex(0)
    advanceFlow(3, FLOW_STEPS[1].name)
  }

  const finishJourney = () => {
    if (taskCompleted.current) return
    taskCompleted.current = true
    logStepComplete(
      VARIANT_ID,
      3,
      FLOW_STEPS[2].name,
      Date.now() - stepEnteredAt.current,
    )
    const success =
      destination?.toLowerCase().includes(TASK_DESTINATION.toLowerCase()) ?? false
    completeTask(VARIANT_ID, success)
  }

  useEffect(() => {
    if (
      flowStep === 3 &&
      journeySteps.length > 0 &&
      journeyActiveIndex >= journeySteps.length - 1
    ) {
      finishJourney()
    }
  }, [flowStep, journeyActiveIndex, journeySteps.length])

  const goBack = () => {
    trackClick(`back-from-step-${flowStep}`, true)
    if (flowStep === 3) {
      stepEnteredAt.current = Date.now()
      setFlowStep(2)
    } else if (flowStep === 2) {
      stepEnteredAt.current = Date.now()
      setFlowStep(1)
      setDestination(null)
      setRouteOptions([])
      setSelectedOption(null)
    }
  }

  /* ── STEP 1: Destination search ── */
  if (flowStep === 1) {
    return (
      <div
        className="flex min-h-dvh flex-col font-sans font-medium"
        style={{ backgroundColor: METRO.bg, color: METRO.text }}
      >
        <div className="flex flex-1 flex-col px-6 py-8">
          <p className="mb-2 text-sm uppercase tracking-wide" style={{ color: METRO.muted }}>
            Bước 1 / 3
          </p>
          <h1 className="mb-8 text-2xl font-medium" style={{ color: METRO.text }}>
            Bạn muốn đi đâu?
          </h1>

          <label className="relative mb-6 block">
            <Search
              className="pointer-events-none absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2"
              style={{ color: METRO.muted }}
            />
            <input
              type="search"
              value={query}
              placeholder="Nhập điểm đến (vd: Suối Tiên)"
              onChange={(e) => {
                ensureTaskStart()
                setQuery(e.target.value)
                trackClick('search-input', true)
              }}
              onFocus={() => ensureTaskStart()}
              className="w-full rounded-2xl border-2 py-5 pl-14 pr-5 text-xl font-medium outline-none"
              style={{
                backgroundColor: METRO.card,
                borderColor: METRO.mapGrid,
                color: METRO.text,
                boxShadow: METRO.cardShadow,
              }}
              autoComplete="off"
            />
          </label>

          <ul className="flex-1 space-y-2 overflow-y-auto">
            {suggestions.map((loc) => (
              <li key={loc}>
                <button
                  type="button"
                  onClick={() => selectDestination(loc)}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-4 text-left text-lg font-medium transition-colors"
                  style={{
                    backgroundColor: METRO.card,
                    boxShadow: METRO.cardShadow,
                    color: METRO.text,
                  }}
                >
                  <MapPin className="h-5 w-5 shrink-0" style={{ color: METRO.primary }} />
                  {loc}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  /* ── STEP 2: Route selection + focused map ── */
  if (flowStep === 2 && destination && selectedOption) {
    return (
      <div
        className="flex min-h-dvh flex-col font-sans font-medium"
        style={{ backgroundColor: METRO.bg, color: METRO.text }}
      >
        <header className="flex items-center gap-3 px-5 py-4">
          <button
            type="button"
            onClick={goBack}
            className="text-base font-medium"
            style={{ color: METRO.primary }}
          >
            ← Quay lại
          </button>
        </header>

        <div className="flex flex-1 flex-col overflow-y-auto px-5 pb-6">
          <p className="mb-1 text-sm uppercase tracking-wide" style={{ color: METRO.muted }}>
            Bước 2 / 3
          </p>
          <h1 className="mb-1 text-2xl font-medium">Chọn tuyến phù hợp</h1>
          <p className="mb-4 text-base" style={{ color: METRO.muted }}>
            Đến <span style={{ color: METRO.primary }}>{destination}</span>
          </p>

          {/* Focused map — only selected route */}
          <div
            className="mb-5 overflow-hidden rounded-2xl p-3"
            style={{ backgroundColor: METRO.card, boxShadow: METRO.cardShadow }}
          >
            <div className="h-40">
              <FocusMap route={selectedOption.route} destination={destination} />
            </div>
            <p className="mt-2 text-sm" style={{ color: METRO.muted }}>
              Chỉ hiển thị tuyến {selectedOption.route.id} — các tuyến khác đã ẩn
            </p>
          </div>

          <div className="space-y-3">
            {routeOptions.map((opt) => {
              const active = selectedOption.id === opt.id
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    ensureTaskStart()
                    trackClick(`route-option-${opt.route.id}`, true)
                    setSelectedOption(opt)
                  }}
                  className="flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all"
                  style={{
                    backgroundColor: active ? METRO.activeStep : METRO.card,
                    borderColor: active ? METRO.primary : METRO.mapGrid,
                    opacity: active ? 1 : 0.55,
                    boxShadow: active ? METRO.cardShadow : 'none',
                  }}
                >
                  <RouteTag
                    routeId={opt.route.id}
                    color={active ? METRO.primary : METRO.inactive}
                    size="md"
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-lg font-medium"
                      style={{ color: active ? METRO.text : METRO.inactive }}
                    >
                      {opt.label}
                      {opt.isRecommended && active && (
                        <span
                          className="ml-2 rounded-full px-2 py-0.5 text-sm"
                          style={{ backgroundColor: METRO.primary, color: '#fff' }}
                        >
                          Đề xuất
                        </span>
                      )}
                    </p>
                    <p className="text-base" style={{ color: METRO.muted }}>
                      {opt.travelTimeMin} phút · {opt.stopCount} trạm · Khởi hành sau{' '}
                      {opt.nextDeparture} phút
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={confirmRoute}
            className="mt-6 w-full rounded-2xl py-4 text-lg font-medium text-white"
            style={{ backgroundColor: METRO.primary }}
          >
            Xem hành trình
          </button>
        </div>
      </div>
    )
  }

  /* ── STEP 3: Journey instructions ── */
  if (flowStep === 3 && destination && selectedOption) {
    return (
      <div
        className="flex min-h-dvh flex-col font-sans font-medium"
        style={{ backgroundColor: METRO.bg, color: METRO.text }}
      >
        <header className="flex items-center gap-3 px-5 py-4">
          <button
            type="button"
            onClick={goBack}
            className="text-base font-medium"
            style={{ color: METRO.primary }}
          >
            ← Quay lại
          </button>
        </header>

        <div className="flex flex-1 flex-col overflow-y-auto px-5 pb-8">
          <p className="mb-1 text-sm uppercase tracking-wide" style={{ color: METRO.muted }}>
            Bước 3 / 3
          </p>
          <h1 className="mb-4 text-2xl font-medium">Hành trình của bạn</h1>

          <div
            className="mb-5 overflow-hidden rounded-2xl p-3"
            style={{ backgroundColor: METRO.card, boxShadow: METRO.cardShadow }}
          >
            <div className="h-32">
              <FocusMap route={selectedOption.route} destination={destination} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-[auto_1fr]">
            <StepIndicator
              steps={journeySteps.map((s) => ({ id: s.id, label: s.verb }))}
              activeIndex={journeyActiveIndex}
            />

            <div className="space-y-3">
              {journeySteps.map((step, i) => {
                const Icon = JOURNEY_ICONS[step.icon]
                const isActive = i === journeyActiveIndex
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => {
                      trackClick(`journey-step-${step.id}`, true)
                      setJourneyActiveIndex(i)
                    }}
                    className="flex w-full items-start gap-3 rounded-2xl border-2 p-4 text-left"
                    style={{
                      backgroundColor: isActive ? METRO.activeStep : METRO.card,
                      borderColor: isActive ? METRO.primary : 'transparent',
                      boxShadow: METRO.cardShadow,
                    }}
                  >
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: isActive ? METRO.primary : METRO.bg,
                        color: isActive ? '#fff' : METRO.muted,
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium uppercase tracking-wide"
                        style={{ color: METRO.primary }}
                      >
                        {step.verb}
                      </p>
                      <p className="text-lg font-medium leading-snug">{step.text}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {journeyActiveIndex < journeySteps.length - 1 ? (
            <button
              type="button"
              onClick={() => {
                trackClick('journey-next', true)
                setJourneyActiveIndex((i) => i + 1)
              }}
              className="mt-6 w-full rounded-2xl py-4 text-lg font-medium text-white"
              style={{ backgroundColor: METRO.primary }}
            >
              Tiếp theo
            </button>
          ) : (
            <p
              className="mt-6 rounded-2xl px-4 py-4 text-center text-lg font-medium"
              style={{ backgroundColor: METRO.activeStep, color: METRO.primary }}
            >
              ✓ Hành trình đã sẵn sàng
            </p>
          )}
        </div>
      </div>
    )
  }

  return null
}
