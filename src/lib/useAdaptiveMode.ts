import { useCallback, useEffect, useRef, useState } from 'react'
import { logClick, logHesitation } from './telemetry'

const HESITATION_MS = 3000
const STORAGE_KEY = 'buspass_senior_mode'

export interface AdaptiveModeState {
  seniorMode: boolean
  showPrompt: boolean
  hesitationCount: number
  misclickStreak: number
  acceptSeniorMode: () => void
  dismissPrompt: () => void
  recordTouch: (target: string) => void
  recordMisclick: (target: string) => void
  recordSuccessfulInteraction: () => void
}

export function useAdaptiveMode(variantId?: string): AdaptiveModeState {
  const [seniorMode, setSeniorMode] = useState(
    () => localStorage.getItem(STORAGE_KEY) === 'true',
  )
  const [showPrompt, setShowPrompt] = useState(false)
  const [hesitationCount, setHesitationCount] = useState(0)
  const [misclickStreak, setMisclickStreak] = useState(0)

  const lastTouchTarget = useRef<string | null>(null)
  const lastTouchAt = useRef<number>(0)
  const hesitationTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const promptDismissed = useRef(
    sessionStorage.getItem('buspass_senior_prompt_dismissed') === 'true',
  )

  const maybeShowPrompt = useCallback(() => {
    if (seniorMode || showPrompt || promptDismissed.current) return
    setShowPrompt(true)
  }, [seniorMode, showPrompt])

  const clearHesitationTimer = () => {
    if (hesitationTimer.current) {
      clearTimeout(hesitationTimer.current)
      hesitationTimer.current = null
    }
  }

  const recordTouch = useCallback(
    (target: string) => {
      lastTouchTarget.current = target
      lastTouchAt.current = Date.now()
      clearHesitationTimer()

      hesitationTimer.current = setTimeout(() => {
        setHesitationCount((c) => {
          const next = c + 1
          if (variantId) logHesitation(variantId, target)
          if (next >= 1) maybeShowPrompt()
          return next
        })
      }, HESITATION_MS)
    },
    [maybeShowPrompt, variantId],
  )

  const recordMisclick = useCallback(
    (target: string) => {
      if (variantId) logClick(variantId, target, false)
      setMisclickStreak((prev) => {
        const sameTarget = lastTouchTarget.current === target
        const next = sameTarget ? prev + 1 : 1
        lastTouchTarget.current = target
        if (next >= 2) maybeShowPrompt()
        return next
      })
    },
    [maybeShowPrompt, variantId],
  )

  const recordSuccessfulInteraction = useCallback(() => {
    clearHesitationTimer()
    setMisclickStreak(0)
    lastTouchTarget.current = null
  }, [])

  const acceptSeniorMode = useCallback(() => {
    setSeniorMode(true)
    localStorage.setItem(STORAGE_KEY, 'true')
    setShowPrompt(false)
    document.body.classList.add('d6-senior-mode')
  }, [])

  const dismissPrompt = useCallback(() => {
    setShowPrompt(false)
    promptDismissed.current = true
    sessionStorage.setItem('buspass_senior_prompt_dismissed', 'true')
    setMisclickStreak(0)
    setHesitationCount(0)
  }, [])

  useEffect(() => {
    if (seniorMode) document.body.classList.add('d6-senior-mode')
    else document.body.classList.remove('d6-senior-mode')
  }, [seniorMode])

  useEffect(() => () => clearHesitationTimer(), [])

  return {
    seniorMode,
    showPrompt,
    hesitationCount,
    misclickStreak,
    acceptSeniorMode,
    dismissPrompt,
    recordTouch,
    recordMisclick,
    recordSuccessfulInteraction,
  }
}
