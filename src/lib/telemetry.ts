const STORAGE_KEY = 'buspass_telemetry'
const SESSION_ID_KEY = 'buspass_sessionId'

export type SessionEventType =
  | 'task_start'
  | 'click'
  | 'misclick'
  | 'hesitation'
  | 'task_complete'
  | 'task_abandon'
  | 'step_complete'

export interface SessionEvent {
  sessionId: string
  variantId: string
  timestamp: number
  eventType: SessionEventType
  target?: string
  userId?: string
  taskDurationMs?: number
  success?: boolean
  seniorModeActivated?: boolean
  urgencyLevelAtComplete?: number
  step?: number
  stepName?: string
}

export interface VariantSummary {
  variantId: string
  sessionCount: number
  avgDurationMs: number
  successRate: number
  misclickRate: number
  seniorModeRate: number
}

interface ActiveTask {
  variantId: string
  userId: string
  startedAt: number
}

let activeTask: ActiveTask | null = null

export function getSessionId(): string {
  let id = sessionStorage.getItem(SESSION_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem(SESSION_ID_KEY, id)
  }
  return id
}

/** New participant session — called when kiosk wakes from screensaver. */
export function resetSessionId(): string {
  const id = crypto.randomUUID()
  sessionStorage.setItem(SESSION_ID_KEY, id)
  activeTask = null
  return id
}

export function getActiveTaskVariant(): string | null {
  return activeTask?.variantId ?? null
}

export function hasActiveTask(): boolean {
  return activeTask !== null
}

function loadEvents(): SessionEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as SessionEvent[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveEvents(events: SessionEvent[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
}

function push(event: Omit<SessionEvent, 'sessionId' | 'timestamp'> & { timestamp?: number }) {
  const full: SessionEvent = {
    sessionId: getSessionId(),
    timestamp: event.timestamp ?? Date.now(),
    ...event,
  }
  const events = loadEvents()
  events.push(full)
  saveEvents(events)
}

export function startTask(variantId: string, userId: string) {
  activeTask = { variantId, userId, startedAt: Date.now() }
  push({ variantId, eventType: 'task_start', userId })
}

export function logClick(variantId: string, target: string, isHit: boolean) {
  push({
    variantId,
    eventType: isHit ? 'click' : 'misclick',
    target,
  })
}

export function logHesitation(variantId: string, target?: string) {
  push({ variantId, eventType: 'hesitation', target })
}

export function logStepComplete(
  variantId: string,
  step: number,
  stepName: string,
  durationMs: number,
) {
  push({
    variantId,
    eventType: 'step_complete',
    target: stepName,
    step,
    stepName,
    taskDurationMs: durationMs,
  })
}

export function completeTask(
  variantId: string,
  success: boolean,
  meta?: { seniorModeActivated?: boolean; urgencyLevelAtComplete?: number },
) {
  const durationMs = activeTask?.variantId === variantId ? Date.now() - activeTask.startedAt : 0
  push({
    variantId,
    eventType: 'task_complete',
    success,
    taskDurationMs: durationMs,
    seniorModeActivated: meta?.seniorModeActivated,
    urgencyLevelAtComplete: meta?.urgencyLevelAtComplete,
  })
  if (activeTask?.variantId === variantId) activeTask = null
}

export function abandonTask(variantId: string) {
  const durationMs = activeTask?.variantId === variantId ? Date.now() - activeTask.startedAt : 0
  push({ variantId, eventType: 'task_abandon', taskDurationMs: durationMs })
  if (activeTask?.variantId === variantId) activeTask = null
}

export function getMisclickRate(variantId: string): number {
  const events = loadEvents().filter((e) => e.variantId === variantId)
  const clicks = events.filter((e) => e.eventType === 'click').length
  const misclicks = events.filter((e) => e.eventType === 'misclick').length
  const total = clicks + misclicks
  if (total === 0) return 0
  return misclicks / total
}

export function getVariantSummary(variantId: string): VariantSummary {
  const summaries = getSummaryByVariant()
  return (
    summaries.find((s) => s.variantId === variantId) ?? {
      variantId,
      sessionCount: 0,
      avgDurationMs: 0,
      successRate: 0,
      misclickRate: 0,
      seniorModeRate: 0,
    }
  )
}

export function getTotalSessions(): number {
  const ids = new Set(loadEvents().map((e) => e.sessionId))
  return ids.size
}

export function getSummaryByVariant(): VariantSummary[] {
  const events = loadEvents()
  const variantIds = [...new Set(events.map((e) => e.variantId))]

  return variantIds.map((variantId) => {
    const variantEvents = events.filter((e) => e.variantId === variantId)
    const sessionIds = new Set(
      variantEvents.filter((e) => e.eventType === 'task_start').map((e) => e.sessionId),
    )
    const completes = variantEvents.filter((e) => e.eventType === 'task_complete')
    const successes = completes.filter((e) => e.success).length
    const avgDuration =
      completes.length > 0
        ? completes.reduce((sum, e) => sum + (e.taskDurationMs ?? 0), 0) / completes.length
        : 0
    const seniorActivations = completes.filter((e) => e.seniorModeActivated).length

    return {
      variantId,
      sessionCount: sessionIds.size || new Set(variantEvents.map((e) => e.sessionId)).size,
      avgDurationMs: Math.round(avgDuration),
      successRate: completes.length > 0 ? successes / completes.length : 0,
      misclickRate: getMisclickRate(variantId),
      seniorModeRate: completes.length > 0 ? seniorActivations / completes.length : 0,
    }
  })
}

function escapeCsv(value: string | number | boolean | undefined | null): string {
  if (value === undefined || value === null) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

/** Export all session events as a CSV string. */
export function exportSessionData(): string {
  const events = loadEvents()
  const headers = [
    'sessionId',
    'variantId',
    'timestamp',
    'eventType',
    'target',
    'userId',
    'taskDurationMs',
    'success',
    'seniorModeActivated',
    'urgencyLevelAtComplete',
    'step',
    'stepName',
  ]

  const rows = events.map((e) =>
    [
      e.sessionId,
      e.variantId,
      e.timestamp,
      e.eventType,
      e.target,
      e.userId,
      e.taskDurationMs,
      e.success,
      e.seniorModeActivated,
      e.urgencyLevelAtComplete,
      e.step,
      e.stepName,
    ]
      .map(escapeCsv)
      .join(','),
  )

  return [headers.join(','), ...rows].join('\n')
}

export function exportSessionDataJson(): string {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      sessionId: getSessionId(),
      events: loadEvents(),
      summary: getSummaryByVariant(),
    },
    null,
    2,
  )
}

export function clearTelemetry() {
  activeTask = null
  localStorage.removeItem(STORAGE_KEY)
}
