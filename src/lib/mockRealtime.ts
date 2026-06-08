import { useEffect, useState } from 'react'
import type { BusRouteData, BusRoutesFile } from '../data/busRoutes'
import raw from '../data/busRoutes.json'

export type UrgencyLevel = 0 | 1 | 2 | 3

const TICK_MS = 3000
const DELAY_CHECK_MS = 120_000
const RESET_DISTANCE_M = 1500

const DELAY_REASONS = [
  'Ùn tắc tại ngã tư Đinh Tiên Hoàng',
  'Tai nạn nhỏ trên đường Lê Lợi',
  'Mưa lớn — xe di chuyển chậm',
  'Đường tắc tại Cầu Sài Gòn',
] as const

export interface RealtimeSnapshot {
  routes: BusRouteData[]
  station: BusRoutesFile['station']
  distanceM: number
  urgencyLevel: UrgencyLevel
  busDeparted: boolean
  activeRouteId: string
}

function cloneRoutes(): BusRouteData[] {
  return JSON.parse(JSON.stringify(raw.routes)) as BusRouteData[]
}

function distanceToLevel(m: number): UrgencyLevel {
  if (m <= 0) return 3
  if (m <= 500) return 2
  if (m <= 1000) return 1
  return 0
}

let state: RealtimeSnapshot = {
  routes: cloneRoutes(),
  station: raw.station,
  distanceM: 1000,
  urgencyLevel: 1,
  busDeparted: false,
  activeRouteId: '08',
}

let tickTimer: ReturnType<typeof setInterval> | null = null
let delayTimer: ReturnType<typeof setInterval> | null = null
let departedTimer: ReturnType<typeof setTimeout> | null = null
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((fn) => fn())
}

function getSnapshot(): RealtimeSnapshot {
  return { ...state, routes: state.routes.map((r) => ({ ...r, stops: [...r.stops] })) }
}

function tickDistance() {
  const decrement = 50 + Math.floor(Math.random() * 101)
  let next = state.distanceM - decrement

  if (next <= 0) {
    state.busDeparted = true
    next = RESET_DISTANCE_M
    if (departedTimer) clearTimeout(departedTimer)
    departedTimer = setTimeout(() => {
      state.busDeparted = false
      emit()
    }, TICK_MS)
  }

  state.distanceM = next
  state.urgencyLevel = distanceToLevel(next)
  emit()
}

function maybeAddDelay() {
  if (Math.random() > 0.2) return
  const route = state.routes.find((r) => r.id === state.activeRouteId) ?? state.routes[0]
  if (!route) return
  const extra = 2 + Math.floor(Math.random() * 7)
  route.currentDelay += extra
  route.delayReason = DELAY_REASONS[Math.floor(Math.random() * DELAY_REASONS.length)]
  emit()
}

export function startRealtimeSimulator(activeRouteId = '08') {
  state.activeRouteId = activeRouteId
  if (!tickTimer) {
    tickTimer = setInterval(tickDistance, TICK_MS)
  }
  if (!delayTimer) {
    delayTimer = setInterval(maybeAddDelay, DELAY_CHECK_MS)
  }
  emit()
}

export function stopRealtimeSimulator() {
  if (tickTimer) clearInterval(tickTimer)
  if (delayTimer) clearInterval(delayTimer)
  if (departedTimer) clearTimeout(departedTimer)
  tickTimer = null
  delayTimer = null
  departedTimer = null
}

export function resetRealtimeSimulator(activeRouteId = '08') {
  state = {
    routes: cloneRoutes(),
    station: raw.station,
    distanceM: 1000,
    urgencyLevel: 1,
    busDeparted: false,
    activeRouteId,
  }
  emit()
}

export function setActiveRealtimeRoute(routeId: string) {
  state.activeRouteId = routeId
  emit()
}

export function subscribeRealtime(fn: () => void) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function getRealtimeSnapshot(): RealtimeSnapshot {
  return getSnapshot()
}

export function getRealtimeRoutes(): BusRouteData[] {
  return getSnapshot().routes
}

export function useMockRealtime(activeRouteId: string) {
  const [snap, setSnap] = useState<RealtimeSnapshot>(getSnapshot)

  useEffect(() => {
    startRealtimeSimulator(activeRouteId)
    const unsub = subscribeRealtime(() => setSnap(getSnapshot()))
    return () => {
      unsub()
    }
  }, [activeRouteId])

  useEffect(() => {
    setActiveRealtimeRoute(activeRouteId)
  }, [activeRouteId])

  return snap
}
