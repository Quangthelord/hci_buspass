import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import type { Destination, Lang } from '../data/mockData'
import { STATION } from '../data/mockData'

const IDLE_MS = 60_000
const QR_TIMEOUT_MS = 180_000

export interface A11ySettings {
  highContrast: boolean
  largeText: boolean
  magnifier: 100 | 200 | 300 | 400
  screenReader: boolean
  voiceActive: boolean
}

interface KioskState {
  lang: Lang
  setLang: (l: Lang) => void
  destination: Destination | null
  setDestination: (d: Destination | null) => void
  selectedRouteId: string | null
  setSelectedRouteId: (id: string | null) => void
  welcomeKey: number
  resetSession: () => void
  touchActivity: () => void
  a11y: A11ySettings
  setA11y: (patch: Partial<A11ySettings>) => void
  idleSecondsLeft: number | null
  qrCountdown: number | null
  startQrCountdown: () => void
  speak: (text: string) => void
}

const KioskContext = createContext<KioskState | null>(null)

export function KioskProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [lang, setLang] = useState<Lang>('vi')
  const [destination, setDestination] = useState<Destination | null>(null)
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null)
  const [welcomeKey, setWelcomeKey] = useState(0)
  const [idleSecondsLeft, setIdleSecondsLeft] = useState<number | null>(null)
  const [qrCountdown, setQrCountdown] = useState<number | null>(null)
  const [a11y, setA11yState] = useState<A11ySettings>({
    highContrast: false,
    largeText: false,
    magnifier: 100,
    screenReader: false,
    voiceActive: false,
  })

  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const idleTick = useRef<ReturnType<typeof setInterval> | null>(null)
  const qrTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  const setA11y = useCallback((patch: Partial<A11ySettings>) => {
    setA11yState((prev) => ({ ...prev, ...patch }))
  }, [])

  const resetSession = useCallback(() => {
    setDestination(null)
    setSelectedRouteId(null)
    setQrCountdown(null)
    setWelcomeKey((k) => k + 1)
    navigate('/')
  }, [navigate])

  const clearIdle = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current)
    if (idleTick.current) clearInterval(idleTick.current)
    idleTimer.current = null
    idleTick.current = null
    setIdleSecondsLeft(null)
  }, [])

  const touchActivity = useCallback(() => {
    clearIdle()
    const deadline = Date.now() + IDLE_MS
    setIdleSecondsLeft(Math.ceil(IDLE_MS / 1000))

    idleTick.current = setInterval(() => {
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
      setIdleSecondsLeft(left)
      if (left <= 0 && idleTick.current) clearInterval(idleTick.current)
    }, 1000)

    idleTimer.current = setTimeout(() => {
      resetSession()
    }, IDLE_MS)
  }, [clearIdle, resetSession])

  const startQrCountdown = useCallback(() => {
    if (qrTimer.current) clearInterval(qrTimer.current)
    setQrCountdown(Math.ceil(QR_TIMEOUT_MS / 1000))
    qrTimer.current = setInterval(() => {
      setQrCountdown((c) => {
        if (c === null || c <= 1) {
          if (qrTimer.current) clearInterval(qrTimer.current)
          resetSession()
          return null
        }
        return c - 1
      })
    }, 1000)
  }, [resetSession])

  const speak = useCallback(
    (text: string) => {
      if (!a11y.screenReader && !a11y.voiceActive) return
      if (typeof window === 'undefined' || !window.speechSynthesis) return
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      u.lang = lang === 'vi' ? 'vi-VN' : lang === 'ko' ? 'ko-KR' : lang === 'zh' ? 'zh-CN' : 'en-US'
      window.speechSynthesis.speak(u)
    },
    [a11y.screenReader, a11y.voiceActive, lang],
  )

  useEffect(() => {
    touchActivity()
    return () => {
      clearIdle()
      if (qrTimer.current) clearInterval(qrTimer.current)
    }
  }, [touchActivity, clearIdle])

  useEffect(() => {
    const body = document.body
    body.classList.toggle('a11y-high-contrast', a11y.highContrast)
    body.classList.toggle('a11y-large-text', a11y.largeText)
    body.classList.remove('a11y-magnifier-200', 'a11y-magnifier-300')
    if (a11y.magnifier === 200) body.classList.add('a11y-magnifier-200')
    if (a11y.magnifier === 300) body.classList.add('a11y-magnifier-300')
    if (a11y.magnifier >= 400) body.classList.add('a11y-magnifier-300')
  }, [a11y])

  const value = useMemo(
    () => ({
      lang,
      setLang,
      destination,
      setDestination,
      selectedRouteId,
      setSelectedRouteId,
      welcomeKey,
      resetSession,
      touchActivity,
      a11y,
      setA11y,
      idleSecondsLeft,
      qrCountdown,
      startQrCountdown,
      speak,
    }),
    [
      lang,
      destination,
      selectedRouteId,
      welcomeKey,
      resetSession,
      touchActivity,
      a11y,
      setA11y,
      idleSecondsLeft,
      qrCountdown,
      startQrCountdown,
      speak,
    ],
  )

  return <KioskContext.Provider value={value}>{children}</KioskContext.Provider>
}

export function useKiosk() {
  const ctx = useContext(KioskContext)
  if (!ctx) throw new Error('useKiosk must be used within KioskProvider')
  return ctx
}

export function stationName(lang: Lang): string {
  return lang === 'vi' ? STATION.nameVi : STATION.nameEn
}
