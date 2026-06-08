import { METRO } from './constants'

export function StepIndicator({
  steps,
  activeIndex,
}: {
  steps: { id: string; label: string }[]
  activeIndex: number
}) {
  return (
    <div className="flex flex-col" role="list" aria-label="Tiến trình hành trình">
      {steps.map((step, i) => {
        const isActive = i === activeIndex
        const isDone = i < activeIndex
        const isLast = i === steps.length - 1

        return (
          <div key={step.id} className="flex gap-3" role="listitem">
            <div className="flex flex-col items-center">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium"
                style={{
                  backgroundColor: isActive ? METRO.primary : isDone ? METRO.activeStep : METRO.card,
                  color: isActive || isDone ? METRO.primary : METRO.inactive,
                  border: `2px solid ${isActive ? METRO.primary : isDone ? METRO.primary : METRO.mapGrid}`,
                }}
                aria-current={isActive ? 'step' : undefined}
              >
                {i + 1}
              </div>
              {!isLast && (
                <div
                  className="my-1 w-0.5 flex-1 min-h-[2rem]"
                  style={{
                    backgroundColor: isDone ? METRO.primary : METRO.mapGrid,
                  }}
                />
              )}
            </div>
            <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
              <p
                className="text-base font-medium leading-snug"
                style={{ color: isActive ? METRO.primary : isDone ? METRO.text : METRO.inactive }}
              >
                {step.label}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
